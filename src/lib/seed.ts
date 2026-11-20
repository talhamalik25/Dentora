import { connectToDatabase } from "./db";
import { ServiceModel } from "@/models/Service";
import { DentistModel } from "@/models/Dentist";
import { ScheduleModel } from "@/models/Schedule";
import { ClinicSettingsModel } from "@/models/ClinicSettings";
import { UserModel } from "@/models/User";
import { hashPassword } from "./auth";
import { demoServices } from "@/features/marketing/services";
import { demoSpecialists } from "@/features/marketing/specialists";
import { clinicConfig } from "@/config/clinic.config";

/**
 * Ensures the database contains baseline clinic configuration,
 * services, dentists, and default schedules.
 * In production, default administrative accounts are NEVER automatically created.
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

      // Default weekly schedule (Mon-Fri 09:00 - 17:00)
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

  // 4. Default Admin User:
  // Strictly disallowed in production. In non-production only, seed demo account with Argon2id hash.
  if (process.env.NODE_ENV !== "production") {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const argonHash = await hashPassword("admin123");
      await UserModel.create({
        email: "admin@dentora.example",
        passwordHash: argonHash,
        name: "Clinic Administrator (Development)",
        role: "admin",
        active: true,
      });
    }
  }

  return true;
}

/**
 * Explicit administrator provisioning utility for production environments.
 */
export async function provisionAdminUser(params: {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "receptionist" | "dentist";
}) {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Cannot provision user: Database connection is not available.");
  }

  const cleanEmail = params.email.toLowerCase().trim();
  const existing = await UserModel.findOne({ email: cleanEmail });
  if (existing) {
    throw new Error(`User with email ${cleanEmail} already exists.`);
  }

  const passwordHash = await hashPassword(params.password);
  const user = await UserModel.create({
    email: cleanEmail,
    passwordHash,
    name: params.name.trim(),
    role: params.role || "admin",
    active: true,
  });

  return { id: String(user._id), email: user.email, name: user.name, role: user.role };
}
