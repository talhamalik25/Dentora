import { NextRequest, NextResponse } from "next/server";
import { getAuthStaff } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { PatientModel } from "@/models/Patient";
import { demoSpecialists } from "@/features/marketing/specialists";
import { demoServices } from "@/features/marketing/services";

export async function GET(request: NextRequest) {
  const staff = await getAuthStaff(request);
  if (!staff) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database service unavailable." },
        { status: 503 }
      );
    }

    const query: Record<string, unknown> = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const appointments = await AppointmentModel.find(query)
      .sort({ startsAtUtc: -1 })
      .limit(100)
      .lean();

    const enriched = await Promise.all(
      appointments.map(async (appt) => {
        const patient = await PatientModel.findById(appt.patientId).lean();
        const doc = demoSpecialists.find((d) => d.id === appt.dentistId);
        const srv = demoServices.find((s) => s.id === appt.serviceId);

        return {
          id: String(appt._id),
          reference: appt.reference,
          patientName: patient?.name || "Patient",
          patientEmail: patient?.email || "—",
          patientPhone: patient?.phone || "—",
          dentistName: doc?.name || appt.dentistId,
          serviceName: srv?.name || appt.serviceId,
          startsAtUtc: appt.startsAtUtc,
          endsAtUtc: appt.endsAtUtc,
          status: appt.status,
          rescheduleCount: appt.rescheduleCount || 0,
          createdAt: appt.createdAt,
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Admin appointments GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve appointments." },
      { status: 500 }
    );
  }
}
