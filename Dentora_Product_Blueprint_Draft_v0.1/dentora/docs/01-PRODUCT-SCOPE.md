# Product scope

## Goal
Dentora is a responsive dental-clinic web platform allowing prospective patients to discover treatments, check availability and request/confirm appointments; clinic staff securely manage the schedule. The platform will also serve as a realistic portfolio demonstration.

## Actors
- Visitor / patient: browse services, choose dentist and slot, make/manage a booking using secure confirmation links.
- Receptionist: manage appointments and basic patient contact records.
- Dentist: view assigned calendar, appointment details necessary for service, manage availability according to policy.
- Clinic admin: manage users, staff, services, schedules, content, and operational reports.

## V1 in scope
- Public pages: Home, About, Services listing/detail, Dentists listing/profile, Contact, Booking, confirmation/status, privacy, terms.
- Appointment booking: choose service/dentist/date/time, availability with timezone awareness, identity/contact collection, confirmation, cancellation/rescheduling policies, notifications.
- Admin app: secure sign-in, overview, calendar, appointments, dentists, hours, services, receptionist access, basic patient directory, clinic settings.
- Basic reporting: upcoming bookings, statuses, appointments per day/week, cancellations/no-shows.
- Demo-safe seeded clinic data and clearly marked placeholders until provided with real content.

## Explicitly excluded from V1 unless approved
- Payments, insurance, medical history, clinical diagnoses, treatment notes, prescriptions, EHR/EMR, insurance claims.
- Patient login portal, public reviews submission, multiple locations, multi-tenant SaaS, AI diagnosis/chatbots, SMS/WhatsApp integration.
- Video consultations, multilingual content, complex staff payroll, inventory.

## Success criteria
- Visitor can book an available slot and receive confirmation.
- Concurrent attempts cannot reserve the same dentist/time.
- Staff can search, confirm, reschedule, cancel, complete, or mark no-show according to permissions.
- Admin can update dentist schedules and offered services without code changes.
- Site works on mobile and is keyboard accessible.

## Product assumption to confirm
Is appointment creation instantly confirmed or initially pending staff approval? Draft assumes **instant confirmation**, with admin override for exceptional changes.
