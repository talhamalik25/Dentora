import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ServiceModel } from "@/models/Service";
import { demoServices } from "@/features/marketing/services";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const services = await ServiceModel.find({ active: true })
        .sort({ displayOrder: 1 })
        .lean();

      if (services && services.length > 0) {
        return NextResponse.json({
          success: true,
          data: services.map((s) => ({
            id: s.slug || String(s._id),
            name: s.name,
            description: s.description,
            durationMinutes: s.durationMinutes,
            active: s.active,
          })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: demoServices,
    });
  } catch (error) {
    console.error("Services API error:", error);
    return NextResponse.json({
      success: true,
      data: demoServices,
    });
  }
}
