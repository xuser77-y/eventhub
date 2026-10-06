# Phase 01: Project setup

**Date:** 2026-10-06
**Status:** Ready for review

## 1. What was built
- Created the Git repository and the top-level `backend/` and `frontend/` applications.
- Added the Express application skeleton, central error handling, PostgreSQL pool, graceful shutdown, and `GET /api/health`.
- Added the Vite and React scaffold with `react-router-dom` installed and no product UI.
- Added environment examples, local ignored environment files, package scripts, and project ignore rules.

## 2. Files created / modified
| File | Purpose |
|---|---|
| .gitignore | Excludes dependencies, build output, logs, and local environment files. |
| backend/package.json | Backend scripts and Phase 1 dependencies. |
| backend/.env.example | Documents required backend environment variables. |
| backend/src/app.js | Configures the Express application and middleware order. |
| backend/src/server.js | Starts the HTTP server and handles graceful shutdown. |
| backend/src/config/env.js | Loads and validates environment variables at startup. |
| backend/src/config/db.js | Provides the PostgreSQL pool and query helpers. |
| backend/src/routes/index.js | Mounts the health-check route. |
| backend/src/middlewares/notFound.js | Returns consistent JSON for unknown routes. |
| backend/src/middlewares/errorHandler.js | Produces the shared API error format. |
| backend/src/utils/AppError.js | Defines application errors. |
| backend/src/utils/asyncHandler.js | Passes asynchronous route errors to the error handler. |
| frontend/package.json | Frontend scripts and Vite/React dependencies. |
| frontend/.env.example | Documents the API base URL variable. |
| frontend/index.html | Vite HTML entry point. |
| frontend/src/main.jsx | React entry point. |
| frontend/src/App.jsx | Router scaffold without product UI. |

## 3. How to run and test
1. In `backend/`, run `npm start`.
2. Request `http://localhost:5000/api/health`.
3. Expected result: HTTP 200 with `{ "status": "ok" }`.
4. In `frontend/`, run `npm run dev` and open the URL printed by Vite.
5. To verify the production bundle, run `npm run build` in `frontend/`.

## 4. Decisions & assumptions
- Used ES modules consistently across the backend.
- Initialized Git because the supplied project folder did not yet contain a repository.
- The local `.env` files are ignored and contain the machine-specific database credentials and frontend API URL.

## 5. Deviations from the instructions
- None.

## 6. Requirement checklist for this phase
- [x] Repository structure created, including `backend/` and `frontend/`.
- [x] Backend and frontend package files and environment examples added.
- [x] Express server skeleton, health route, not-found handler, error handler, `AppError`, and `asyncHandler` added.
- [x] React/Vite scaffold and `react-router-dom` installed without product UI.
- [x] Database connection verified.
- [x] `GET /api/health` verified with HTTP 200.
- [x] Frontend production build verified.

## 7. Known limitations / questions for the reviewer
- None.

## 8. Next phase
- Phase 02: Database migrations and seed data. **Waiting for approval.**
