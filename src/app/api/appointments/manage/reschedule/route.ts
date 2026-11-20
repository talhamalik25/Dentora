import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";
import { ServiceModel } from "@/models/Service";
import { AuditLogModel } from "@/models/AuditLog";
import { verifyPatientManageToken } from "@/lib/auth";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { bookingLimiter, getClientIp } from "@/lib/rate-limit";
import { computeOccupancySlotUnits } from "@/lib/availability";
import { demoServices } from "@/features/marketing/services";

export async function POST(request: NextRequest) {
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked." },
      { status: 403 }
    );
  }

  const clientIp = getClientIp(request);
  const rateCheck = bookingLimiter.check(clientIp, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many reschedule attempts. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const { token, newStartsAtUtc, newDentistId } = body;

    if (!token || !newStartsAtUtc) {
      return NextResponse.json(
        { success: false, error: "Management token and new appointment time are required." },
        { status: 400 }
      );
    }

    const payload = verifyPatientManageToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired appointment management link. Please request a new link." },
        { status: 401 }
      );
    }

    const newStart = new Date(newStartsAtUtc);
    if (isNaN(newStart.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid new appointment start time." },
        { status: 400 }
      );
    }

    const now = Date.now();
    // Rule: Must be at least 2 hours in advance and at most 60 days ahead
    if (newStart.getTime() - now < 2 * 60 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "Rescheduled appointments must be at least 2 hours in advance." },
        { status: 400 }
      );
    }
    if (newStart.getTime() - now > 60 * 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "Appointments cannot be booked more than 60 days in advance." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database service unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const appointment = await AppointmentModel.findById(payload.appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment record not found." },
        { status: 404 }
      );
    }

    if (appointment.status !== "confirmed") {
      return NextResponse.json(
        { success: false, error: `Cannot reschedule an appointment that is ${appointment.status}.` },
        { status: 400 }
      );
    }

    // 1. Enforce 12-hour cutoff rule
    const currentStartMs = new Date(appointment.startsAtUtc).getTime();
    const hoursRemaining = (currentStartMs - now) / (1000 * 60 * 60);
    if (hoursRemaining < 12) {
      return NextResponse.json(
        {
          success: false,
          error: "Appointments cannot be rescheduled online within 12 hours of the scheduled time. Please call the clinic directly.",
        },
        { status: 400 }
      );
    }

    // 2. Enforce maximum 2 reschedules limit
    if ((appointment.rescheduleCount || 0) >= 2) {
      return NextResponse.json(
        {
          success: false,
          error: "This appointment has reached the maximum allowed limit of 2 online reschedules. Please contact the clinic directly.",
        },
        { status: 400 }
      );
    }

    const targetDentistId = newDentistId || appointment.dentistId;

    // Determine service duration and buffers
    let durationMinutes = 30;
    let bufferAfterMinutes = 10;
    const staticService = demoServices.find((s) => s.id === appointment.serviceId);
    if (staticService) durationMinutes = staticService.durationMinutes;

    const serviceDoc = await ServiceModel.findOne({ slug: appointment.serviceId }).lean();
    if (serviceDoc) {
      durationMinutes = serviceDoc.durationMinutes;
      bufferAfterMinutes = serviceDoc.bufferAfterMinutes || 0;
    }

    const newEnd = new Date(newStart.getTime() + durationMinutes * 60 * 1000);

    // Compute required slot units for the new appointment time
    const newSlotUnits = computeOccupancySlotUnits(
      newStart,
      durationMinutes,
      bufferAfterMinutes,
      15
    );

    // Concurrency check: Ensure no OTHER appointment occupies any of the target units
    const conflict = await SlotOccupancyModel.findOne({
      dentistId: targetDentistId,
      slotUtc: { $in: newSlotUnits.map((u) => u.slotUtc) },
      appointmentId: { $ne: appointment._id },
    });

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          error: "The requested time slot has already been reserved. Your current appointment remains unchanged.",
        },
        { status: 409 }
      );
    }

    // Backup existing occupancies in case rollback is required
    const existingOccupancies = await SlotOccupancyModel.find({
      appointmentId: appointment._id,
    }).lean();

    // Release existing occupancies
    await SlotOccupancyModel.deleteMany({ appointmentId: appointment._id });

    // Prepare new occupancy records
    const newOccupancyDocs = newSlotUnits.map((u) => ({
      dentistId: targetDentistId,
      slotUtc: u.slotUtc,
      appointmentId: appointment._id,
      isBuffer: u.isBuffer,
    }));

    try {
      await SlotOccupancyModel.insertMany(newOccupancyDocs, { ordered: true });
    } catch (insertErr) {
      // Roll back: restore previous occupancies so original booking remains protected
      await SlotOccupancyModel.deleteMany({ appointmentId: appointment._id });
      if (existingOccupancies.length > 0) {
        await SlotOccupancyModel.insertMany(
          existingOccupancies.map((occ) => ({
            dentistId: occ.dentistId,
            slotUtc: occ.slotUtc,
            appointmentId: occ.appointmentId,
            isBuffer: occ.isBuffer,
          }))
        );
      }

      console.error("Reschedule occupancy collision:", insertErr);
      return NextResponse.json(
        {
          success: false,
          error: "A conflict occurred while reserving the new time slot. Your original appointment time was preserved.",
        },
        { status: 409 }
      );
    }

    // Update appointment record
    const prevStartUtc = appointment.startsAtUtc;
    appointment.startsAtUtc = newStart;
    appointment.endsAtUtc = newEnd;
    appointment.dentistId = targetDentistId;
    appointment.rescheduleCount = (appointment.rescheduleCount || 0) + 1;
    await appointment.save();

    // Audit log
    await AuditLogModel.create({
      action: "appointment.rescheduled",
      entityType: "Appointment",
      entityId: appointment._id.toString(),
      actorType: "patient",
      actorId: payload.email,
      metadata: {
        reference: appointment.reference,
        fromStartsAtUtc: prevStartUtc.toISOString(),
        toStartsAtUtc: newStart.toISOString(),
        rescheduleCount: appointment.rescheduleCount,
        dentistId: targetDentistId,
      },
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment successfully rescheduled.",
      data: {
        reference: appointment.reference,
        status: appointment.status,
        startsAtUtc: appointment.startsAtUtc,
        endsAtUtc: appointment.endsAtUtc,
        dentistId: appointment.dentistId,
        rescheduleCount: appointment.rescheduleCount,
        reschedulesRemaining: Math.max(0, 2 - appointment.rescheduleCount),
      },
    });
  } catch (error) {
    console.error("Reschedule appointment error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while rescheduling your appointment." },
      { status: 500 }
    );
  }
}
