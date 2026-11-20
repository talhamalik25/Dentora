import { NextRequest, NextResponse } from "next/server";
import { getAuthStaff } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getAuthStaff(request);
  if (!staff) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status, reason } = await request.json();

    if (!["confirmed", "completed", "no-show", "cancelled"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value." }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db) {
      const appt = await AppointmentModel.findById(id);
      if (!appt) {
        return NextResponse.json({ success: false, error: "Appointment not found." }, { status: 404 });
      }

      appt.status = status;
      if (reason) appt.cancellationReason = reason;
      await appt.save();

      // If cancelled, release occupied slot
      if (status === "cancelled") {
        await SlotOccupancyModel.deleteOne({ appointmentId: appt._id });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: String(appt._id),
          status: appt.status,
          reference: appt.reference,
        },
      });
    }

    // Demo simulation response
    return NextResponse.json({
      success: true,
      data: { id, status, reference: "DNT-SIMULATED" },
    });
  } catch (error) {
    console.error("Update appointment API error:", error);
    return NextResponse.json({ success: false, error: "Failed to update appointment." }, { status: 500 });
  }
}
