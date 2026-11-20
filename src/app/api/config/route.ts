import { NextResponse } from "next/server";
import { clinicConfig } from "@/config/clinic.config";
import { connectToDatabase } from "@/lib/db";
import { ClinicSettingsModel } from "@/models/ClinicSettings";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await ClinicSettingsModel.findOne({ slug: "default" }).lean();
      if (settings) {
        return NextResponse.json({
          success: true,
          data: {
            identity: {
              ...clinicConfig.identity,
              name: settings.name,
            },
            scheduling: {
              timezone: settings.timeZone,
              slotIntervalMinutes: settings.slotIntervalMinutes,
              bookingMinNoticeHours: settings.bookingMinNoticeHours,
              bookingMaxDaysAhead: settings.bookingMaxDaysAhead,
              cancellationCutoffHours: settings.cancellationCutoffHours,
              maxPatientReschedules: settings.maxPatientReschedules,
              instantConfirmation: settings.instantConfirmation,
            },
            features: clinicConfig.features,
            theme: clinicConfig.theme,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: clinicConfig,
    });
  } catch (error) {
    console.error("Config API error:", error);
    return NextResponse.json({
      success: true,
      data: clinicConfig,
    });
  }
}
