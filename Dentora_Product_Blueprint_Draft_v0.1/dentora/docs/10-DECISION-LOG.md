# Decisions to confirm (status: OPEN)

| ID | Decision | Working recommendation | Status |
|---|---|---|---|
| D01 | Clinic scope | Single clinic, single location, multiple dentists | OPEN |
| D02 | Booking status | Instantly confirmed when slot is available | OPEN |
| D03 | Visitor account | No login required; secure management link | OPEN |
| D04 | Patient verification | Verify email via expiring link for management, optionally before booking | OPEN |
| D05 | Staff roles | Admin + Receptionist + Dentist | OPEN |
| D06 | Payments | Out of scope in v1 | OPEN |
| D07 | Visit modes | In-person appointments only | OPEN |
| D08 | Cancel/reschedule | Self-service with 24-hour cutoff | OPEN |
| D09 | Slot policy | 15-minute increments, 2-hour notice, 60-day horizon | OPEN |
| D10 | Notifications | Email first; WhatsApp/SMS later | OPEN |
| D11 | Patient records | Contact + booking history only; no treatment/medical notes | OPEN |
| D12 | Language & currency | English; clinic timezone Asia/Karachi; PKR if prices shown | OPEN |
| D13 | Content | Clearly labeled fictional/demo clinic until real clinic details supplied | OPEN |
| D14 | Deployment | Vercel + MongoDB Atlas (pending architecture checks) | OPEN |

## Proposed freeze process
Discuss high-impact D01-D05 first, then remaining decisions. Update scope, journeys and data model to match. Mark accepted decisions `APPROVED` with date. Begin implementation only when critical decisions are approved.
