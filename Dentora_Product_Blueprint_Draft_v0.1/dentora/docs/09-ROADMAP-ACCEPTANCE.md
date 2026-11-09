# Roadmap and acceptance criteria

## Planning gate (current)
Deliver and approve scope, workflow decisions, role matrix, design specification, data/API blueprints, and test criteria. **No development begins until this gate is accepted.**

## Phase A — Foundation
App setup, route groups, design tokens, shared components, lint/typecheck/tests scaffold. Acceptance: clean build, no secret exposure, functional routes.

## Phase B — Public website
Complete approved pages, responsive layouts, real/marked-demo content. Acceptance: mobile and keyboard flow; SEO basics; no fake claims.

## Phase C — Booking engine
Services/dentists/schedule models, availability, atomic booking, confirmations, management links. Acceptance: no overlap under concurrency, accurate timezone handling, documented policy cases.

## Phase D — Admin workspace
Auth/RBAC, appointment table/calendar, staff/services/schedules, limited patient directory. Acceptance: role enforcement and complete auditable updates.

## Phase E — QA + launch
E2E, integration, load/concurrency checks, backups, accessibility/performance, deployment and monitoring. Acceptance: blocking defects resolved; operational readiness checklist signed.

## Release gate
Before real clinic use, replace demo content, configure verified communication channels, approve privacy terms/retention, confirm legal requirements, and test backup/recovery.
