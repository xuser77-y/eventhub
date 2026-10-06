# Phase 06: Registrations API and dashboard

**Date:** 2026-10-06
**Status:** Ready for review

## 1. What was built
- Added authenticated registration creation, listing, status changes, reactivation, and dashboard metrics.
- Enforced published-event, duplicate, and transactional capacity rules.

## 2. Files created / modified
| File | Purpose |
|---|---|
| backend/src/routes/registrations.routes.js | Registration endpoints. |
| backend/src/controllers/registration.controller.js | Registration HTTP handlers. |
| backend/src/services/registration.service.js | Transactions and business rules R1-R3. |
| backend/src/validators/registration.validator.js | Registration validation. |
| backend/src/routes/dashboard.routes.js | Dashboard endpoint. |
| backend/src/controllers/dashboard.controller.js | Dashboard HTTP handler. |
| backend/src/services/dashboard.service.js | Dashboard aggregate queries. |
| backend/src/routes/index.js | Mounts registrations and dashboard. |

## 3. How to run and test
Use a Bearer token with `POST /api/registrations`, `GET /api/registrations?eventId=&status=`, `PATCH /api/registrations/:id/status`, and `GET /api/dashboard`.

## 4. Decisions & assumptions
- Event-row locking serializes capacity checks for a given event.

## 5. Deviations from the instructions
- None.

## 6. Requirement checklist for this phase
- [x] Non-published events are blocked.
- [x] Duplicate registrations return 409; cancelled rows reactivate.
- [x] Capacity is checked under an event-row lock.
- [x] Registration status transitions are validated.
- [x] Dashboard returns all required metrics and top five published events.

## 7. Known limitations / questions for the reviewer
- None.

## 8. Next phase
- Phase 07: Users API and hardening. **Proceeding under user authorization.**
