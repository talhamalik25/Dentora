import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { DentistModel } from "@/models/Dentist";
import { demoSpecialists } from "@/features/marketing/specialists";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");

    const db = await connectToDatabase();
    if (db) {
      const query: Record<string, unknown> = { active: true };
      if (serviceId) {
        query.serviceIds = serviceId;
      }

      const dentists = await DentistModel.find(query)
        .sort({ displayOrder: 1 })
        .lean();

      if (dentists && dentists.length > 0) {
        return NextResponse.json({
          success: true,
          data: dentists.map((d) => ({
            id: String(d._id),
            name: d.name,
            focus: d.focus,
            summary: d.summary,
            serviceIds: d.serviceIds,
            portrait: d.portrait,
            portraitAlt: d.portraitAlt,
          })),
        });
      }
    }

    // Fallback to static specialists
    let filtered = demoSpecialists;
    if (serviceId) {
      filtered = demoSpecialists.filter((s) => s.focus.toLowerCase().includes(serviceId.toLowerCase()));
      if (filtered.length === 0) filtered = demoSpecialists;
    }

    return NextResponse.json({
      success: true,
      data: filtered.map((s) => ({
        id: s.id,
        name: s.name,
        focus: s.focus,
        summary: s.summary,
        serviceIds: [serviceId || "general"],
        portrait: s.portrait,
        portraitAlt: s.portraitAlt,
      })),
    });
  } catch (error: unknown) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Dentists API error:", error);
    return NextResponse.json({
      success: true,
      data: demoSpecialists,
    });
  }
}
