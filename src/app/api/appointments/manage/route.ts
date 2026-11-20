import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { PatientModel } from "@/models/Patient";
import { verifyPatientManageToken } from "@/lib/auth";
import { demoServices } from "@/features/marketing/services";
import { demoSpecialists } from "@/features/marketing/specialists";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || request.headers.get("authorization")?.replace("Bearer ", "");
    const ref = searchParams.get("ref");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token required to manage appointment." },
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

    if (ref && payload.reference.toUpperCase() !== ref.toUpperCase()) {
      return NextResponse.json(
        { success: false, error: "Token mismatch for requested appointment reference." },
        { status: 403 }
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
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    const patient = await PatientModel.findById(appointment.patientId);

    const now = Date.now();
    const startMs = new Date(appointment.startsAtUtc).getTime();
    const hoursRemaining = (startMs - now) / (1000 * 60 * 60);

    const isCutoffPassed = hoursRemaining < 12;
    const isMaxReschedulesReached = (appointment.rescheduleCount || 0) >= 2;
    const isPast = startMs <= now;
    const isConfirmed = appointment.status === "confirmed";

    const canCancel = isConfirmed && !isCutoffPassed && !isPast;
    const canReschedule = isConfirmed && !isCutoffPassed && !isPast && !isMaxReschedulesReached;

    // Service & specialist names
    const service = demoServices.find((s) => s.id === appointment.serviceId);
    const specialist = demoSpecialists.find((d) => d.id === appointment.dentistId);

    return NextResponse.json({
      success: true,
      data: {
        id: appointment._id.toString(),
        reference: appointment.reference,
        status: appointment.status,
        startsAtUtc: appointment.startsAtUtc,
        endsAtUtc: appointment.endsAtUtc,
        serviceId: appointment.serviceId,
        serviceName: service?.name || appointment.serviceId,
        dentistId: appointment.dentistId,
        dentistName: specialist?.name || "Dentora Dental Specialist",
        patientName: patient?.name || "Patient",
        patientEmail: patient?.email || payload.email,
        patientPhone: patient?.phone || "",
        rescheduleCount: appointment.rescheduleCount || 0,
        maxReschedules: 2,
        reschedulesRemaining: Math.max(0, 2 - (appointment.rescheduleCount || 0)),
        cutoffHours: 12,
        hoursRemaining: Math.round(hoursRemaining * 10) / 10,
        canCancel,
        canReschedule,
        cancellationReason: appointment.cancellationReason,
      },
    });
  } catch (error: unknown) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while retrieving appointment details." },
      { status: 500 }
    );
  }
}
