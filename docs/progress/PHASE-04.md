# Phase 04: Events API

**Date:** 2026-10-06
**Status:** Ready for review

## 1. What was built
- Added authenticated event creation, listing, filtering, detail, and update endpoints.
- Added draft-to-published and cancellation status transitions.
- Enforced capacity reductions against active registrations and made cancelled events immutable.
- Implemented transactional event cancellation that cancels every related registration.

## 2. Files created / modified
| File | Purpose |
|---|---|
| backend/src/routes/events.routes.js | Defines authenticated event endpoints. |
| backend/src/controllers/event.controller.js | Handles event HTTP requests and responses. |
| backend/src/services/event.service.js | Implements event queries, updates, transitions, and transactions. |
| backend/src/validators/event.validator.js | Validates event bodies, IDs, and filters. |
| backend/src/utils/constants.js | Defines role and status transition constants. |
| backend/src/routes/index.js | Mounts the events router. |

## 3. How to run and test
1. In `backend/`, run `npm run migrate`, `npm run seed`, then `npm start`.
2. Log in with `POST /api/auth/login` using the seeded admin credentials and retain the returned token.
3. Use `Authorization: Bearer <token>` for these requests:
   - `POST /api/events` with `title`, `description`, `location`, `eventDate`, and `maxParticipants` creates a draft event.
   - `GET /api/events?status=published&date=YYYY-MM-DD` lists filtered events and active registration counts.
   - `GET /api/events/:id` returns event details.
   - `PUT /api/events/:id` updates allowed fields.
   - `PATCH /api/events/:id/status` with `{ "status": "published" }` publishes a draft.
   - `PATCH /api/events/:id/status` with `{ "status": "cancelled" }` cancels the event and its registrations.
4. Expected protections: no token returns 401; an invalid transition returns 400; reducing capacity below active registrations returns 409.

## 4. Decisions & assumptions
- `registeredCount` reports only pending and confirmed registrations, because cancelled registrations do not consume capacity.
- New events are always created as drafts; API input cannot override that status.
- Event dates use ISO 8601 date-time strings with an offset to preserve the time zone.

## 5. Deviations from the instructions
- None.

## 6. Requirement checklist for this phase
- [x] Create, list, filter, detail, and update event endpoints exist under `/api/events`.
- [x] Event lists and details include active `registeredCount`.
- [x] Event creation sets `createdBy` from the authenticated user and forces `draft` status.
- [x] Status transitions permit draft → published/cancelled and published → cancelled only.
- [x] Cancelled events cannot be edited or transitioned again.
- [x] Lowering capacity below active registrations returns 409.
- [x] Cancelling an event and its registrations occurs in one transaction.
- [x] All event endpoints require a valid JWT and validate inputs.

## 7. Known limitations / questions for the reviewer
- None.

## 8. Next phase
- Phase 05: Participants API. **Waiting for approval.**
