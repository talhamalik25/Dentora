# Roles and permissions — draft

Legend: V=view, M=manage, O=own only, —=no access. All actions must be enforced server-side.

| Capability | Admin | Receptionist | Dentist | Public visitor |
|---|---|---|---|---|
| Public pages | V | V | V | V |
| Create public booking | V | V | V | V |
| All appointments | M | M | — | — |
| Assigned appointments | M | M | V, status updates policy-based | — |
| Patient directory/contact | M | M (limited) | O (minimum necessary) | — |
| Services/prices/content | M | V | V | — |
| Dentist schedules | M | M (if delegated) | O (request/change per policy) | — |
| Clinic settings | M | — | — | — |
| Staff users/roles | M | — | — | — |
| Operational reports | V | V (limited) | O (if approved) | — |
| Audit logs | V | — | — | — |

## Security rules
- Authentication is not authorization: verify role and ownership on every server route.
- Admins cannot access sensitive patient clinical notes because v1 does not store them.
- Public booking management requires one-time/expiring signed token and identity confirmation as appropriate.
- Log privileged changes without storing credentials or sensitive raw payloads.
