import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";
import { AuditLogModel } from "@/models/AuditLog";
import { verifyPatientManageToken } from "@/lib/auth";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { bookingLimiter, getClientIp } from "@/lib/rate-limit";

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
      { success: false, error: "Too many cancellation attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const { token, reason } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Management token required." },
        { status: 401 }
      );
    }

    const payload = verifyPatientManageToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired appointment management link. Please request a new link." },
        { status: 401 }
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
        { success: false, error: `This appointment is already ${appointment.status}.` },
        { status: 400 }
      );
    }

    // Enforce 12-hour cancellation policy
    const now = Date.now();
    const startMs = new Date(appointment.startsAtUtc).getTime();
    const hoursRemaining = (startMs - now) / (1000 * 60 * 60);

    if (hoursRemaining < 12) {
      return NextResponse.json(
        {
          success: false,
          error: "Appointments cannot be cancelled online within 12 hours of the scheduled time. Please contact the clinic directly.",
        },
        { status: 400 }
      );
    }

    // Update appointment status to cancelled
    appointment.status = "cancelled";
    appointment.cancellationReason = reason?.trim() || "Patient self-service cancellation";
    await appointment.save();

    // Release slot occupancy units
    await SlotOccupancyModel.deleteMany({ appointmentId: appointment._id });

    // Record audit log
    await AuditLogModel.create({
      action: "appointment.cancelled",
      entityType: "Appointment",
      entityId: appointment._id.toString(),
      actorType: "patient",
      actorId: payload.email,
      metadata: {
        reference: appointment.reference,
        reason: appointment.cancellationReason,
        startsAtUtc: appointment.startsAtUtc.toISOString(),
      },
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: "Your appointment has been cancelled successfully.",
      data: {
        reference: appointment.reference,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while cancelling your appointment." },
      { status: 500 }
    );
  }
}
