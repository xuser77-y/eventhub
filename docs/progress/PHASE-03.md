# Phase 03: Authentication and security base

**Date:** 2026-10-06
**Status:** Ready for review

## 1. What was built
- Added JWT login and current-user endpoints with bcrypt password verification.
- Added authentication, role authorization, Zod validation, and shared rate-limit middleware.
- Added Helmet, restricted CORS, JSON body-size limits, and server-side user verification for JWTs.
- Added consistent authentication and validation errors without exposing password hashes.

## 2. Files created / modified
| File | Purpose |
|---|---|
| backend/package.json | Adds JWT, Helmet, CORS, and rate-limit dependencies. |
| backend/package-lock.json | Locks the security dependency tree. |
| backend/src/app.js | Enables security middleware and API rate limiting. |
| backend/src/routes/index.js | Mounts authentication routes. |
| backend/src/routes/auth.routes.js | Defines login and current-user routes. |
| backend/src/controllers/auth.controller.js | Handles authentication HTTP responses. |
| backend/src/services/auth.service.js | Performs user lookup, password verification, and JWT signing. |
| backend/src/validators/auth.validator.js | Validates login input. |
| backend/src/middlewares/authenticate.js | Verifies JWTs and loads the current user. |
| backend/src/middlewares/authorize.js | Enforces permitted roles. |
| backend/src/middlewares/validate.js | Runs Zod schemas and formats validation errors. |
| backend/src/middlewares/rateLimiters.js | Applies general and strict login request limits. |
| backend/src/middlewares/errorHandler.js | Preserves empty validation detail arrays when applicable. |

## 3. How to run and test
1. In `backend/`, run `npm start`.
2. Send `POST http://localhost:5000/api/auth/login` with JSON `{ "email": "kenza.benjelloun@eventhub.ma", "password": "EventHub2025!" }`.
3. Expected result: HTTP 200 with a token and public user data, without `passwordHash`.
4. Send `GET http://localhost:5000/api/auth/me` with `Authorization: Bearer <token>`.
5. Expected result: HTTP 200 with the signed-in user.
6. Verify wrong credentials return 401, a missing token returns 401, and invalid login JSON returns 400 with `VALIDATION_ERROR`.

## 4. Decisions & assumptions
- JWT payloads contain only the user ID (`sub`) and role; the middleware reloads the user from the database before every protected request.
- Login uses a generic credentials error to avoid revealing whether an email address exists.
- `app.js` from approved Phase 1 was updated because Phase 3 requires global Helmet, CORS, body-size, and API rate-limit middleware.

## 5. Deviations from the instructions
- None.

## 6. Requirement checklist for this phase
- [x] `POST /api/auth/login` authenticates the seeded admin and staff users.
- [x] `GET /api/auth/me` requires a valid JWT and returns public user data.
- [x] Wrong credentials return 401 with a generic error.
- [x] Missing and invalid tokens return 401.
- [x] Invalid login input returns 400 in the shared error format.
- [x] JWT uses the configured secret and expiry; password hashes are never returned.
- [x] Helmet, restricted CORS, JSON size limit, general API limit, and strict login limit are enabled.
- [x] Reusable authorization middleware is ready for admin-only routes.

## 7. Known limitations / questions for the reviewer
- None.

## 8. Next phase
- Phase 04: Events API. **Waiting for approval.**
