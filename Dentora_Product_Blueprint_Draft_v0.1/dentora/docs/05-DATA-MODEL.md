# Conceptual data model

## ClinicSettings
`name`, `slug`, `timezone`, `address`, `phone`, `email`, `hours`, `closures`, `bookingMinNoticeHours`, `bookingMaxDaysAhead`, `cancellationCutoffHours`, `slotStepMinutes`, `branding`.

## User
`email`, `passwordHash/providerIdentity`, `name`, `role` (admin/receptionist/dentist), `active`, `dentistId?`, `lastLoginAt`, timestamps.

## Dentist
`name`, `bio`, `specialties`, `serviceIds`, `image`, `active`, `displayOrder`, timestamps.

## Service
`name`, `slug`, `description`, `durationMinutes`, `bufferBeforeMinutes`, `bufferAfterMinutes`, `priceDisplay?`, `active`, `dentistIds`, timestamps.

## WeeklyAvailability / ScheduleException
`dentistId`, `weekday`, `localStart`, `localEnd`, `breaks`; exception: `dentistId`, `date/timeRange`, `reasonCode`, `isAvailable`.

## Patient (minimal contact profile, not clinical record)
`name`, `email`, `phone`, `consents`, timestamps. Minimize duplicates; normalize safely.

## Appointment
`reference`, `patientId`, `dentistId`, `serviceId`, `startsAtUtc`, `endsAtUtc`, `timezoneAtBooking`, `status`, `source`, `createdBy?`, `bookingNote?`, `cancellationReason?`, timestamps.

## SlotReservation / Occupancy
Dedicated concurrency-safe time occupancy structure keyed by dentist and discretized UTC time units, uniquely constrained for active bookings; release on cancellation. Architecture/transaction feasibility to be validated in technical design before implementation.

## AppointmentEvent / NotificationOutbox
Event: appointmentId, action, actorId/actorType, timestamp, metadata without secrets. Notification: type, recipient, idempotencyKey, status, attempts, providerReference.

## Indexes and lifecycle
- Appointment `(dentistId, startsAtUtc)` for lookups and calendar rendering.
- Unique reference code.
- Unique active occupancy keys for conflict prevention.
- User email unique (normalized).
- Use server-side validation; never trust client-supplied duration or status transitions.
- Retention, consent, deletion/export requirements to be decided before real-world use.
