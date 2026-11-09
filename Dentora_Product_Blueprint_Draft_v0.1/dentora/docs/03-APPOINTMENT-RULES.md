# Appointment engine — proposed rules

## Time and availability
- Store UTC instants; display in clinic's configured IANA timezone (e.g. `Asia/Karachi`).
- Each service has a duration (minutes) and optional pre/post buffers.
- Dentist must be active, qualified/assigned to service, and scheduled to work.
- Respect clinic opening hours, dentist recurring weekly hours, breaks, holidays/closures and one-off leave.
- Slot interval initially 15 minutes, configurable by admin; actual reservation occupies duration + buffers.
- No appointment may overlap another active booking for the same dentist, including buffers.
- Bookings cannot be in the past; default advance notice: 2 hours; max advance window: 60 days (both configurable).
- Any Dentist option chooses an eligible free dentist server-side; confirm selection before final submit.

## Atomic conflict prevention
A slot query is informational only. On submit, recheck availability within the booking write operation. Implement a reliable concurrency strategy (for example a slot-lock collection with a unique compound index and transaction, plus overlap-safe occupancy units). A naive `findOne` then `insert` is not sufficient.

## Status model
`confirmed` -> `completed`, `no_show`, `cancelled`, or `rescheduled` (reschedule can also retain booking with audit history). Optional `pending` mode is deferred until approval workflow is chosen. Maintain immutable audit entries for status changes.

## Cancellation and rescheduling
- Draft patient self-service cutoff: 24 hours before start; staff may override with recorded reason.
- Rescheduling always requires another atomic slot check.
- Never erase historical bookings when cancelled; release occupied slot only after authoritative state change.

## Notifications
- Confirmation / reschedule / cancellation via email initially, provided transport is configured.
- Do not claim delivery unless the provider confirms; track queued, sent and failed states.
- Use idempotent notification jobs to prevent duplicates on retries.

## Open policy questions
- Instant confirmed vs request/approval?
- Are patient bookings allowed without verifying email or phone?
- Should staff be able to double-book with explicit override? Draft: no.
- How are services with multiple sequential staff/resources handled? Draft: excluded.
