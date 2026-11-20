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
    if (db) {
      const query: Record<string, unknown> = {};
      if (status && status !== "all") {
        query.status = status;
      }

      const appointments = await AppointmentModel.find(query)
        .sort({ startsAtUtc: -1 })
        .limit(50)
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
            createdAt: appt.createdAt,
          };
        })
      );

      return NextResponse.json({ success: true, data: enriched });
    }

    // Demo fallback records for offline testing
    const now = new Date();
    const demoRecords = [
      {
        id: "demo-appt-1",
        reference: "DNT-7A9B1C",
        patientName: "Emma Watson",
        patientEmail: "emma.w@example.com",
        patientPhone: "+1 (555) 234-5678",
        dentistName: "Maya Bennett",
        serviceName: "General dentistry",
        startsAtUtc: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
        endsAtUtc: new Date(now.getTime() + 24.5 * 3600 * 1000).toISOString(),
        status: "confirmed",
        createdAt: now.toISOString(),
      },
      {
        id: "demo-appt-2",
        reference: "DNT-3F8K2M",
        patientName: "Marcus Sterling",
        patientEmail: "m.sterling@example.com",
        patientPhone: "+1 (555) 876-5432",
        dentistName: "Daniel Reed",
        serviceName: "Cosmetic dentistry",
        startsAtUtc: new Date(now.getTime() + 48 * 3600 * 1000).toISOString(),
        endsAtUtc: new Date(now.getTime() + 48.75 * 3600 * 1000).toISOString(),
        status: "confirmed",
        createdAt: now.toISOString(),
      },
      {
        id: "demo-appt-3",
        reference: "DNT-9P4W7X",
        patientName: "Sophia Lin",
        patientEmail: "sophia.l@example.com",
        patientPhone: "+1 (555) 345-6789",
        dentistName: "Alex Morgan",
        serviceName: "Restorative care",
        startsAtUtc: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
        endsAtUtc: new Date(now.getTime() - 23 * 3600 * 1000).toISOString(),
        status: "completed",
        createdAt: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(),
      },
    ];

    let filtered = demoRecords;
    if (status && status !== "all") {
      filtered = demoRecords.filter((d) => d.status === status);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Admin appointments API error:", error);
    return NextResponse.json({ success: false, error: "Failed to load appointments." }, { status: 500 });
  }
}
