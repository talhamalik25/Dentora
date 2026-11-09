# Sitemap & UX specification

## Public routes
- `/` Home — hero, care proposition, service preview, team preview, process, contact CTA.
- `/about` Clinic story, mission, facilities (verified claims only).
- `/services` Category/list cards, duration/pricing if supplied.
- `/services/[slug]` Treatment overview, suitability disclaimer, FAQ, booking CTA.
- `/dentists` Provider listing and availability entry point.
- `/dentists/[slug]` Profile, credentials only if verified, service areas.
- `/book-appointment` Multi-step booking: service -> dentist -> date/time -> contact -> review.
- `/appointment/confirmation` Success and reference (avoid leaking personal details in URL).
- `/appointment/manage` Secure token flow for cancel/reschedule.
- `/contact`, `/privacy`, `/terms`.

## Admin routes
- `/admin/login` Secure access entry.
- `/admin/dashboard` Today’s summary, next appointments, warnings.
- `/admin/appointments` List and filtering.
- `/admin/calendar` Day/week calendar.
- `/admin/patients` Minimal contact directory.
- `/admin/dentists` Profiles and assignments.
- `/admin/schedules` Weekly slots, exceptions, clinic closures.
- `/admin/services` Services and durations.
- `/admin/staff` Invites and roles (admin only).
- `/admin/settings` Clinic details and policies.

## UI principles
- Design: deep teal, white, light mint, champagne accent; accessible contrast.
- Responsive 320px through desktop; keyboard operable; reduced-motion support.
- Booking wizard must retain input when returning to previous step and clearly announce errors.
- Use skeleton/loading and empty/error states for all data-driven views.
- Real media must be properly licensed; no fake patients/ratings/certifications.
- Admin dashboard prioritizes tasks over decorative charts.
