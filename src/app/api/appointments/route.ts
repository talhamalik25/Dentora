import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PatientModel } from "@/models/Patient";
import { AppointmentModel } from "@/models/Appointment";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";
import { ServiceModel } from "@/models/Service";
import { demoServices } from "@/features/marketing/services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, dentistId, startsAtUtc, patient } = body;

    if (!serviceId || !dentistId || !startsAtUtc || !patient?.name || !patient?.email) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields (serviceId, dentistId, startsAtUtc, patient name/email)." },
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

    // Determine duration
    let durationMinutes = 30;
    const staticService = demoServices.find((s) => s.id === serviceId);
    if (staticService) durationMinutes = staticService.durationMinutes;

    const db = await connectToDatabase();
    if (db) {
      const serviceDoc = await ServiceModel.findOne({ slug: serviceId }).lean();
      if (serviceDoc) durationMinutes = serviceDoc.durationMinutes;

      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      // Check slot conflict
      const existingOccupancy = await SlotOccupancyModel.findOne({
        dentistId,
        startUtc: start,
      });

      if (existingOccupancy) {
        return NextResponse.json(
          { success: false, error: "This appointment slot was just reserved. Please select another time." },
          { status: 409 }
        );
      }

      // Upsert patient
      let patientDoc = await PatientModel.findOne({ email: patient.email.toLowerCase().trim() });
      if (!patientDoc) {
        patientDoc = await PatientModel.create({
          name: patient.name.trim(),
          email: patient.email.toLowerCase().trim(),
          phone: patient.phone?.trim() || "",
        });
      }

      // Generate random reference code: DNT-XXXXXX
      const reference = `DNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Create appointment
      const appt = await AppointmentModel.create({
        reference,
        patientId: patientDoc._id,
        dentistId,
        serviceId,
        startsAtUtc: start,
        endsAtUtc: end,
        timeZone: "UTC",
        status: "confirmed",
      });

      // Record slot occupancy
      await SlotOccupancyModel.create({
        dentistId,
        startUtc: start,
        endUtc: end,
        appointmentId: appt._id,
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
        },
      });
    }

    // Fallback simulation for offline/preview environments
    const reference = `DNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return NextResponse.json({
      success: true,
      data: {
        reference,
        status: "confirmed",
        startsAtUtc: start.toISOString(),
        endsAtUtc: new Date(start.getTime() + durationMinutes * 60 * 1000).toISOString(),
        patientName: patient.name,
        patientEmail: patient.email,
        isDemoSimulation: true,
      },
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your booking." },
      { status: 500 }
    );
  }
}
