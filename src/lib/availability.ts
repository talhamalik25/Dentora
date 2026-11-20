import { connectToDatabase } from "./db";
import { ScheduleModel } from "@/models/Schedule";
import { ServiceModel } from "@/models/Service";
import { DentistModel } from "@/models/Dentist";
import { SlotOccupancyModel } from "@/models/SlotOccupancy";
import { demoServices } from "@/features/marketing/services";
import { demoSpecialists } from "@/features/marketing/specialists";

export interface AvailableSlot {
  dentistId: string;
  dentistName: string;
  serviceId: string;
  startsAtUtc: string; // ISO 8601 UTC
  displayTime: string;  // e.g. "09:30 AM"
  durationMinutes: number;
}

/**
 * Calculates all 15-minute slot units occupied by an appointment,
 * including treatment duration and post-procedure sterilization buffers.
 */
export function computeOccupancySlotUnits(
  startUtc: Date,
  durationMinutes: number,
  bufferMinutes: number = 0,
  intervalMinutes: number = 15
): { slotUtc: Date; isBuffer: boolean }[] {
  const units: { slotUtc: Date; isBuffer: boolean }[] = [];
  const totalMinutes = durationMinutes + bufferMinutes;
  let currentMs = startUtc.getTime();
  const endTreatmentMs = currentMs + durationMinutes * 60 * 1000;
  const totalEndMs = currentMs + totalMinutes * 60 * 1000;

  while (currentMs < totalEndMs) {
    units.push({
      slotUtc: new Date(currentMs),
      isBuffer: currentMs >= endTreatmentMs,
    });
    currentMs += intervalMinutes * 60 * 1000;
  }

  return units;
}

/**
 * Calculates available appointment slots for a given date, service, and dentist.
 * Enforces:
 * - 2-hour minimum advance notice
 * - 60-day maximum advance booking horizon
 * - Full treatment duration availability
 * - Pre/post sterilization buffers
 * - Dentist working shift intervals and exception leaves
 * - Slot occupancy locks preventing overlapping collisions
 */
export async function getAvailableSlots(params: {
  date: string; // "YYYY-MM-DD"
  serviceId: string;
  dentistId?: string | null;
}): Promise<AvailableSlot[]> {
  const { date, serviceId, dentistId } = params;

  // Validate date format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return [];
  }

  const targetDate = new Date(`${date}T00:00:00Z`);
  const now = new Date();

  // Rule: Must be at least 2 hours in advance and at most 60 days ahead
  const minNoticeMs = 2 * 60 * 60 * 1000;
  const maxHorizonMs = 60 * 24 * 60 * 60 * 1000;

  if (targetDate.getTime() + 24 * 60 * 60 * 1000 < now.getTime()) {
    return []; // In the past
  }
  if (targetDate.getTime() - now.getTime() > maxHorizonMs) {
    return []; // Beyond 60-day horizon
  }

  // Determine duration and buffers
  let durationMinutes = 30;
  let bufferAfterMinutes = 10;

  const staticService = demoServices.find((s) => s.id === serviceId);
  if (staticService) {
    durationMinutes = staticService.durationMinutes;
  }

  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Database service unavailable. Real-time slot availability cannot be determined.");
  }

  const sDoc = await ServiceModel.findOne({ slug: serviceId }).lean();
  if (sDoc) {
    durationMinutes = sDoc.durationMinutes;
    bufferAfterMinutes = sDoc.bufferAfterMinutes || 0;
  }

  // Determine target dentists
  const targetDentistIds: string[] = [];
  if (dentistId && dentistId !== "any") {
    targetDentistIds.push(dentistId);
  } else {
    const allDentists = await DentistModel.find({ active: true }).lean();
    if (allDentists.length > 0) {
      allDentists.forEach((d) => targetDentistIds.push(String(d._id)));
    } else {
      demoSpecialists.forEach((s) => targetDentistIds.push(s.id));
    }
  }

  const slots: AvailableSlot[] = [];
  const dayOfWeek = targetDate.getUTCDay();

  for (const dId of targetDentistIds) {
    const dentistObj = demoSpecialists.find((s) => s.id === dId);
    const dentistName = dentistObj ? dentistObj.name : "Dentist";

    let workingIntervals = [{ start: "09:00", end: "17:00" }];

    if (db) {
      const schedule = await ScheduleModel.findOne({ dentistId: dId }).lean();
      if (schedule) {
        // Check exceptions first
        const exception = schedule.exceptions?.find((e) => e.localDate === date);
        if (exception) {
          workingIntervals = exception.intervals;
        } else {
          const dayPlan = schedule.weekly?.find((w) => w.dayOfWeek === dayOfWeek);
          workingIntervals = dayPlan ? dayPlan.intervals : [];
        }
      }
    }

    if (workingIntervals.length === 0) {
      continue;
    }

    // Fetch existing occupied slot units for this dentist on this day
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    const occupiedSlotsSet = new Set<number>();
    if (db) {
      const occupancies = await SlotOccupancyModel.find({
        dentistId: dId,
        slotUtc: { $gte: dayStart, $lte: dayEnd },
      }).lean();

      occupancies.forEach((occ) => {
        occupiedSlotsSet.add(new Date(occ.slotUtc).getTime());
      });
    }

    // Step through working intervals in 15-minute slot intervals
    for (const interval of workingIntervals) {
      const [startH, startM] = interval.start.split(":").map(Number);
      const [endH, endM] = interval.end.split(":").map(Number);

      const intervalStartTime = new Date(`${date}T00:00:00.000Z`);
      intervalStartTime.setUTCHours(startH, startM, 0, 0);

      const intervalEndTime = new Date(`${date}T00:00:00.000Z`);
      intervalEndTime.setUTCHours(endH, endM, 0, 0);

      let currentSlotStart = new Date(intervalStartTime);

      while (currentSlotStart.getTime() + durationMinutes * 60 * 1000 <= intervalEndTime.getTime()) {
        // Check minimum notice (at least 2 hours in future)
        if (currentSlotStart.getTime() - now.getTime() >= minNoticeMs) {
          // Compute all slot units required for this candidate appointment (duration + buffer)
          const neededUnits = computeOccupancySlotUnits(
            currentSlotStart,
            durationMinutes,
            bufferAfterMinutes,
            15
          );

          // Verify NONE of the required slot units are already occupied
          const hasConflict = neededUnits.some((unit) =>
            occupiedSlotsSet.has(unit.slotUtc.getTime())
          );

          if (!hasConflict) {
            const h = currentSlotStart.getUTCHours();
            const m = currentSlotStart.getUTCMinutes();
            const ampm = h >= 12 ? "PM" : "AM";
            const displayH = h % 12 || 12;
            const displayM = m < 10 ? `0${m}` : m;
            const displayTime = `${displayH}:${displayM} ${ampm}`;

            slots.push({
              dentistId: dId,
              dentistName,
              serviceId,
              startsAtUtc: currentSlotStart.toISOString(),
              displayTime,
              durationMinutes,
            });
          }
        }

        // Increment by 15-minute slot interval
        currentSlotStart = new Date(currentSlotStart.getTime() + 15 * 60 * 1000);
      }
    }
  }

  // Sort by time
  return slots.sort((a, b) => new Date(a.startsAtUtc).getTime() - new Date(b.startsAtUtc).getTime());
}
