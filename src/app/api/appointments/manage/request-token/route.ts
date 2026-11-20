import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { PatientModel } from "@/models/Patient";
import { signPatientManageToken } from "@/lib/auth";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { authLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked." },
      { status: 403 }
    );
  }

  const clientIp = getClientIp(request);
  const rateCheck = authLimiter.check(clientIp, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again in a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const { reference, email } = body;

    if (!reference || !email) {
      return NextResponse.json(
        { success: false, error: "Appointment reference and email are required." },
        { status: 400 }
      );
    }

    const cleanRef = String(reference).toUpperCase().trim();
    const cleanEmail = String(email).toLowerCase().trim();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database service unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const patient = await PatientModel.findOne({ email: cleanEmail });
    if (!patient) {
      return NextResponse.json(
        { success: false, error: "No appointment found matching this reference and email." },
        { status: 404 }
      );
    }

    const appointment = await AppointmentModel.findOne({
      reference: cleanRef,
      patientId: patient._id,
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "No appointment found matching this reference and email." },
        { status: 404 }
      );
    }

    const token = signPatientManageToken({
      appointmentId: appointment._id.toString(),
      reference: appointment.reference,
      email: cleanEmail,
    });

    return NextResponse.json({
      success: true,
      token,
      manageUrl: `/book/manage?ref=${encodeURIComponent(appointment.reference)}&token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    console.error("Request token error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
