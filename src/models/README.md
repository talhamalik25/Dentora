# Future persistence boundary

Mongoose schemas belong here when the backend phase begins. No database connection or model is initialized in Phase 1. Keep persistence imports server-only; shared transport contracts live in `src/types/clinic.ts`.

Before accepting bookings: validate all inputs, resolve IANA local time with explicit daylight-saving ambiguity rules, store UTC instants, and recheck schedules and availability on the server. Protect overlaps with transactional slot claims and unique indexes (a start-time index alone cannot protect overlapping durations), plus idempotency keys. Authorize every admin operation server-side. Define patient consent, retention, access auditing, and minimal public responses before storing personal information. Never send patient records in availability responses or put secrets in NEXT_PUBLIC variables.
