import { NextRequest, NextResponse } from "next/server";
import { getAuthStaff } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppointmentModel } from "@/models/Appointment";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";
import { AuditLogModel } from "@/models/AuditLog";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { getClientIp } from "@/lib/rate-limit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked." },
      { status: 403 }
    );
  }

  const staff = await getAuthStaff(request);
  if (!staff) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
  }

  // Role authorization: admin, receptionist, or dentist
  if (!["admin", "receptionist", "dentist"].includes(staff.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { status, reason } = await request.json();

    if (!["confirmed", "completed", "no-show", "cancelled"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value." }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database service unavailable." },
        { status: 503 }
      );
    }

    const appt = await AppointmentModel.findById(id);
    if (!appt) {
      return NextResponse.json({ success: false, error: "Appointment not found." }, { status: 404 });
    }

    const prevStatus = appt.status;
    appt.status = status;
    if (reason) appt.cancellationReason = reason;
    await appt.save();

    // If cancelled, release ALL occupied slot units for this appointment
    if (status === "cancelled") {
      await SlotOccupancyModel.deleteMany({ appointmentId: appt._id });
    }

    // Audit log
    await AuditLogModel.create({
      action: `appointment.status_updated`,
      entityType: "Appointment",
      entityId: appt._id.toString(),
      actorType: "staff",
      actorId: staff.userId,
      metadata: {
        reference: appt.reference,
        fromStatus: prevStatus,
        toStatus: status,
        reason,
      },
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({
      success: true,
      data: {
        id: String(appt._id),
        status: appt.status,
        reference: appt.reference,
      },
    });
  } catch (error) {
    console.error("Update appointment API error:", error);
    return NextResponse.json({ success: false, error: "Failed to update appointment." }, { status: 500 });
  }
}
