import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import { PatientModel } from "@/models/Patient";
import { AppointmentModel } from "@/models/Appointment";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";
import { ServiceModel } from "@/models/Service";
import { AuditLogModel } from "@/models/AuditLog";
import { demoServices } from "@/features/marketing/services";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { bookingLimiter, getClientIp } from "@/lib/rate-limit";
import { computeOccupancySlotUnits } from "@/lib/availability";
import { signPatientManageToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // 1. Verify CSRF / Origin
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked." },
      { status: 403 }
    );
  }

  // 2. Rate limit (10 requests/min per IP)
  const clientIp = getClientIp(request);
  const rateCheck = bookingLimiter.check(clientIp, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many booking requests. Please wait a moment before trying again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const { serviceId, dentistId, startsAtUtc, patient } = body;

    if (!serviceId || !dentistId || !startsAtUtc || !patient?.name || !patient?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking fields (serviceId, dentistId, startsAtUtc, patient name/email).",
        },
        { status: 400 }
      );
    }

    const start = new Date(startsAtUtc);
    if (isNaN(start.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid startsAtUtc timestamp." },
        { status: 400 }
      );
    }

    const now = new Date();
    // Rule: Must be at least 2 hours in advance and at most 60 days ahead
    if (start.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "Appointments must be booked at least 2 hours in advance." },
        { status: 400 }
      );
    }
    if (start.getTime() - now.getTime() > 60 * 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "Appointments cannot be booked more than 60 days in advance." },
        { status: 400 }
      );
    }

    // 3. Connect to Database (Fail Closed)
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: "Database service unavailable. Real-time slot locking could not be performed.",
        },
        { status: 503 }
      );
    }

    // Determine service duration and buffers
    let durationMinutes = 30;
    let bufferAfterMinutes = 10;
    const staticService = demoServices.find((s) => s.id === serviceId);
    if (staticService) durationMinutes = staticService.durationMinutes;

    const serviceDoc = await ServiceModel.findOne({ slug: serviceId }).lean();
    if (serviceDoc) {
      durationMinutes = serviceDoc.durationMinutes;
      bufferAfterMinutes = serviceDoc.bufferAfterMinutes || 0;
    }

    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    // Compute all 15-minute slot units (duration + sterilization buffer)
    const slotUnits = computeOccupancySlotUnits(
      start,
      durationMinutes,
      bufferAfterMinutes,
      15
    );

    const appointmentId = new mongoose.Types.ObjectId();

    // 4. Reserve slot occupancy units atomically via compound unique index
    const occupancyDocs = slotUnits.map((unit) => ({
      dentistId,
      slotUtc: unit.slotUtc,
      appointmentId,
      isBuffer: unit.isBuffer,
    }));

    try {
      await SlotOccupancyModel.insertMany(occupancyDocs, { ordered: true });
    } catch (insertErr: unknown) {
      // Clean up any partially inserted slot units from this batch
      await SlotOccupancyModel.deleteMany({ appointmentId });

      const err = insertErr as { code?: number; name?: string };
      if (err.code === 11000 || err.name === "MongoServerError") {
        return NextResponse.json(
          {
            success: false,
            error: "One or more requested time slots (including preparation/buffer time) have already been reserved. Please select another time.",
          },
          { status: 409 }
        );
      }
      throw insertErr;
    }

    try {
      // 5. Upsert patient record
      const cleanEmail = patient.email.toLowerCase().trim();
      let patientDoc = await PatientModel.findOne({ email: cleanEmail });
      if (!patientDoc) {
        patientDoc = await PatientModel.create({
          name: patient.name.trim(),
          email: cleanEmail,
          phone: patient.phone?.trim() || "",
        });
      } else if (patient.name && patient.name.trim() !== patientDoc.name) {
        // Update contact name if provided
        patientDoc.name = patient.name.trim();
        if (patient.phone) patientDoc.phone = patient.phone.trim();
        await patientDoc.save();
      }

      // Generate cryptographically unique reference: DNT-XXXXXX
      const reference = `DNT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

      // 6. Create Appointment
      const appt = await AppointmentModel.create({
        _id: appointmentId,
        reference,
        patientId: patientDoc._id,
        dentistId,
        serviceId,
        startsAtUtc: start,
        endsAtUtc: end,
        timeZone: "UTC",
        status: "confirmed",
        rescheduleCount: 0,
      });

      // Generate secure 2-hour patient management token
      const manageToken = signPatientManageToken({
        appointmentId: appt._id.toString(),
        reference: appt.reference,
        email: cleanEmail,
      });

      // 7. Audit log creation
      await AuditLogModel.create({
        action: "appointment.created",
        entityType: "Appointment",
        entityId: appt._id.toString(),
        actorType: "patient",
        actorId: cleanEmail,
        metadata: {
          reference: appt.reference,
          dentistId,
          serviceId,
          startsAtUtc: start.toISOString(),
          durationMinutes,
          bufferAfterMinutes,
        },
        ipAddress: clientIp,
      });

      return NextResponse.json({
        success: true,
        data: {
          reference: appt.reference,
          status: appt.status,
          startsAtUtc: appt.startsAtUtc,
          endsAtUtc: appt.endsAtUtc,
          patientName: patientDoc.name,
          patientEmail: patientDoc.email,
          manageToken,
          manageUrl: `/book/manage?ref=${encodeURIComponent(appt.reference)}&token=${encodeURIComponent(manageToken)}`,
        },
      });
    } catch (saveError) {
      // Roll back slot occupancies if appointment creation failed
      await SlotOccupancyModel.deleteMany({ appointmentId });
      throw saveError;
    }
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your booking." },
      { status: 500 }
    );
  }
}
