/** Transport contracts only. Validate untrusted data at future server boundaries. */
export type EntityId = string;
/** ISO 8601 UTC instant, e.g. 2026-11-09T09:00:00.000Z. Validate at runtime. */
export type UtcInstant = string;
/** IANA timezone identifier, e.g. Asia/Karachi. Validate at runtime. */
export type TimeZone = string;
export interface AdminUser { id: EntityId; email: string; name: string; role: "owner" | "admin"; active: boolean }
export interface Dentist { id: EntityId; name: string; serviceIds: EntityId[]; active: boolean }
export interface Service { id: EntityId; name: string; description: string; durationMinutes: number; active: boolean }
/** Sensitive: never expose through public marketing or availability responses. */
export interface Patient { id: EntityId; name: string; email: string; phone?: string; createdAt: UtcInstant }
export interface Appointment { id: EntityId; patientId: EntityId; dentistId: EntityId; serviceId: EntityId; startsAt: UtcInstant; endsAt: UtcInstant; timeZone: TimeZone; status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show"; createdAt: UtcInstant; version: number }
export interface LocalTimeRange { start: string; end: string }
export interface DentistSchedule { id: EntityId; dentistId: EntityId; timeZone: TimeZone; weekly: { dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; intervals: LocalTimeRange[] }[]; exceptions: { localDate: string; intervals: LocalTimeRange[] }[] }
export interface ClinicSettings { id: EntityId; name: string; timeZone: TimeZone; bookingLeadMinutes: number; bookingHorizonDays: number; slotIntervalMinutes: number; cancellationNoticeHours: number }
/** Public availability excludes patient information; a slot is never a reservation. */
export interface AppointmentSlot { dentistId: EntityId; serviceId: EntityId; startsAt: UtcInstant; endsAt: UtcInstant; timeZone: TimeZone }
