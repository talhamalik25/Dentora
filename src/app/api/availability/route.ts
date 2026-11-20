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
  } catch (error: unknown) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Availability API error:", error);
    const err = error as Error;
    const isDbUnavailable = err?.message?.includes("Database service unavailable");
    return NextResponse.json(
      {
        success: false,
        error: isDbUnavailable
          ? "Database unavailable. Real-time slot availability cannot be determined."
          : "Failed to calculate availability.",
      },
      { status: isDbUnavailable ? 503 : 500 }
    );
  }
}
