import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceId = searchParams.get("serviceId") || "general";
    const dentistId = searchParams.get("dentistId");

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date query parameter (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots({
      date,
      serviceId,
      dentistId,
    });

    return NextResponse.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error("Availability API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate availability." },
      { status: 500 }
    );
  }
}
