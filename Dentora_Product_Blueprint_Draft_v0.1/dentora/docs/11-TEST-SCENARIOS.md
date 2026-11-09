# Initial acceptance / test scenarios

## Public UX
- User can navigate service details and dentist profiles on mobile and desktop.
- Booking form preserves selections between steps and validates required fields.
- Error and empty slots views remain usable with keyboard only.

## Availability / concurrency
- Same dentist + overlapping time range cannot be double-booked under simultaneous requests.
- Different dentists may accept appointments at the same time.
- Buffers, breaks, closures, leave and clinic hours block conflicts.
- A service duration crossing closing time is rejected.
- Past times and dates beyond booking horizon are rejected.
- Booking is checked again during final submission after another user takes slot.
- Cancelled booking frees eligible occupancy safely; completed/no-show history retained.
- Reschedule into conflicting slot fails without losing old reservation.
- Double-click/retry with same idempotency key does not create duplicate bookings.

## Roles / security
- Unauthenticated requests to admin data return unauthorized.
- Receptionist cannot modify staff roles or clinic-wide security settings.
- Dentist cannot read other dentists' patient records.
- Public reference search cannot enumerate patient contact details.
- Expired management token is rejected.
- Admin mutation gets audit trail entry with actor, action, time.

## Notifications / resilience
- Failed mail delivery does not silently drop confirmed bookings.
- Retried notification does not duplicate messages.
- Database unavailable yields safe error, no partial booking shown as confirmed.
