import { connectToDatabase } from "./db";
import { ServiceModel } from "@/models/Service";
import { DentistModel } from "@/models/Dentist";
import { ScheduleModel } from "@/models/Schedule";
import { ClinicSettingsModel } from "@/models/ClinicSettings";
import { UserModel } from "@/models/User";
import { demoServices } from "@/features/marketing/services";
import { demoSpecialists } from "@/features/marketing/specialists";
import { clinicConfig } from "@/config/clinic.config";

/**
 * Ensures the database contains baseline clinic configuration,
 * services, dentists, and default schedules. Safe to call idempotently.
 */
export async function ensureDatabaseSeeded() {
  const db = await connectToDatabase();
  if (!db) {
    return false;
  }

  // 1. Seed Clinic Settings if none exist
  const existingSettings = await ClinicSettingsModel.findOne({ slug: "default" });
  if (!existingSettings) {
    await ClinicSettingsModel.create({
      name: clinicConfig.identity.name,
      slug: "default",
      timeZone: clinicConfig.scheduling.timezone,
      address: clinicConfig.contact.address.fullDisplay,
      phone: clinicConfig.contact.phone,
      email: clinicConfig.contact.email,
      bookingMinNoticeHours: clinicConfig.scheduling.bookingMinNoticeHours,
      bookingMaxDaysAhead: clinicConfig.scheduling.bookingMaxDaysAhead,
      cancellationCutoffHours: clinicConfig.scheduling.cancellationCutoffHours,
      slotIntervalMinutes: clinicConfig.scheduling.slotIntervalMinutes,
      maxPatientReschedules: clinicConfig.scheduling.maxPatientReschedules,
      instantConfirmation: clinicConfig.scheduling.instantConfirmation,
    });
  }

  // 2. Seed Services if none exist
  const serviceCount = await ServiceModel.countDocuments();
  if (serviceCount === 0) {
    for (let i = 0; i < demoServices.length; i++) {
      const s = demoServices[i];
      await ServiceModel.create({
        slug: s.id,
        name: s.name,
        description: s.description,
        durationMinutes: s.durationMinutes,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 10,
        active: s.active,
        displayOrder: i + 1,
      });
    }
  }

  // 3. Seed Dentists if none exist
  const dentistCount = await DentistModel.countDocuments();
  if (dentistCount === 0) {
    for (let i = 0; i < demoSpecialists.length; i++) {
      const sp = demoSpecialists[i];
      await DentistModel.create({
        _id: sp.id, // Keep consistent id e.g. "demo-maya"
        name: sp.name,
        focus: sp.focus,
        summary: sp.summary,
        serviceIds: [demoServices[i % demoServices.length].id],
        portrait: sp.portrait,
        portraitAlt: sp.portraitAlt,
        active: true,
        displayOrder: i + 1,
      });

      // Also create a default weekly schedule for each dentist (Mon-Fri 09:00 - 17:00)
      const existingSchedule = await ScheduleModel.findOne({ dentistId: sp.id });
      if (!existingSchedule) {
        await ScheduleModel.create({
          dentistId: sp.id,
          timeZone: clinicConfig.scheduling.timezone,
          weekly: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
            dayOfWeek,
            intervals: [{ start: "09:00", end: "17:00" }],
          })),
          exceptions: [],
        });
      }
    }
  }

  // 4. Seed Default Admin User if none exist (Password: admin123)
  const userCount = await UserModel.countDocuments();
  if (userCount === 0) {
    await UserModel.create({
      email: "admin@dentora.example",
      // Demo hash for "admin123" using simple sha256 hex for development baseline
      passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
      name: "Clinic Administrator",
      role: "admin",
      active: true,
    });
  }

  return true;
}
