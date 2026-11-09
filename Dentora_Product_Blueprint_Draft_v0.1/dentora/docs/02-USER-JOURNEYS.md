# User journeys

## A. Visitor books
1. Visit marketing site and choose Book Appointment.
2. Choose service (shows duration), optionally preferred dentist (or Any available).
3. Choose date; see only available clinic-local time slots.
4. Enter name, email, phone, optional short non-sensitive note; accept privacy notice.
5. Submit; server validates input and atomically reserves slot.
6. Receive booking reference and confirmation screen; email notification is queued or recorded as pending until configured.
7. Manage booking through expiring, unguessable link after appropriate identity verification.

## B. Reception handles booking
1. Authenticate, open appointment calendar/list.
2. Filter by status, dentist, service, date and search contact fields as permitted.
3. Open booking details; change status or reschedule only to an available slot.
4. System records actor/time/reason in audit log and triggers relevant notifications.

## C. Dentist schedule
1. Sign in and view own appointments and availability.
2. Block personal leave (subject to clinic policy); existing bookings trigger conflict warnings.
3. Mark completed/no-show if role permits.

## D. Admin clinic setup
1. Configure clinic timezone, hours, blackout days, contact methods and booking limits.
2. Add services with duration, buffers and assigned dentists.
3. Add dentists and weekly schedules; manage exceptions/leave.
4. Invite authorized staff, assign role, revoke access.

## Important exceptions
- Slot taken between viewing and submit: show conflict and request another time.
- Dentist leaves or clinic closes: flag impacted appointments for staff resolution; never silently delete them.
- Email unavailable: booking persists; notification failure is visible for retry; show on-screen reference.
- Invalid/expired management link: safely reject and offer clinic contact.
