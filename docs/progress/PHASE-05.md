# Phase 05: Participants API

**Date:** 2026-10-06
**Status:** Ready for review

## 1. What was built
- Added authenticated participant CRUD and name/email search.
- Enforced normalized, unique participant email addresses with conflict responses.

## 2. Files created / modified
| File | Purpose |
|---|---|
| backend/src/routes/participants.routes.js | Participant endpoints. |
| backend/src/controllers/participant.controller.js | HTTP controller layer. |
| backend/src/services/participant.service.js | Participant data operations. |
| backend/src/validators/participant.validator.js | Participant input validation. |
| backend/src/routes/index.js | Mounts participant routes. |

## 3. How to run and test
Run the backend, log in, and use the returned Bearer token with `POST`, `GET`, `GET /:id`, `PUT /:id`, and `DELETE /:id` under `/api/participants`. Use `GET /api/participants?search=name-or-email` to search.

## 4. Decisions & assumptions
- Emails are trimmed and lowercased before storage and search.

## 5. Deviations from the instructions
- None.

## 6. Requirement checklist for this phase
- [x] Full participant CRUD exists.
- [x] Search covers name and email.
- [x] Duplicate email returns 409.
- [x] Input and IDs are validated and routes require JWT authentication.

## 7. Known limitations / questions for the reviewer
- None.

## 8. Next phase
- Phase 06: Registrations API and dashboard. **Proceeding under user authorization.**
