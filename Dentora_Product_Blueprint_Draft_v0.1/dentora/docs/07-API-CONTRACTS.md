# Proposed API contracts (not implemented)

Use Next.js route handlers under `/api`. Input/output validation with Zod; consistent error envelope. Final endpoint design to be frozen before backend coding.

## Public endpoints
- `GET /api/services` — active services.
- `GET /api/dentists?serviceId=` — eligible active dentists.
- `GET /api/availability?serviceId=&dentistId=&date=` — available slots in clinic timezone.
- `POST /api/appointments` — create booking; idempotency key expected.
- `POST /api/appointments/manage/request-link` — initiate privacy-safe verification; generic response prevents enumeration.
- `POST /api/appointments/manage/cancel` — verified cancellation under cutoff.
- `POST /api/appointments/manage/reschedule` — verified atomic rebooking.

## Protected staff endpoints
- `GET /api/admin/appointments`, `PATCH /api/admin/appointments/:id`.
- `GET/POST/PATCH /api/admin/dentists`.
- `GET/POST/PATCH /api/admin/services`.
- `GET/POST/PATCH /api/admin/schedules`.
- `GET/PATCH /api/admin/settings`.
- `GET /api/admin/metrics`.

## Standard response sketches
Successful booking:
```json
{"data":{"reference":"DNT-EXAMPLE","status":"confirmed","startsAtUtc":"2026-12-01T05:00:00Z"}}
```
Conflict:
```json
{"error":{"code":"SLOT_UNAVAILABLE","message":"This time is no longer available."}}
```

## Validation & controls
- Rate-limit public write and lookup endpoints.
- CSRF/origin protections on authenticated mutations.
- Do not expose patient contact information through public booking reference lookups.
- Consistent status codes: 400 invalid, 401 unauthenticated, 403 unauthorized, 404 unavailable/not found, 409 booking conflict, 429 rate limited.
- Booking submission supports idempotency; request deduplication should be durable.
