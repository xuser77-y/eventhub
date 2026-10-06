# EventHub: Agent Build Instructions

> **Read this whole file before writing any code.** It is the single source of truth for the project.
> You are building a graded technical test ("Test Technique"). Every requirement below is mandatory unless marked *Bonus*.

---

## 0. How you must work (READ FIRST)

1. **Build phase by phase. Never build everything at once.** The project is split into numbered phases (section 12). Do **only the current phase**.
2. **After each phase, STOP.** Write the phase report (section 13), summarize what you did in the chat, tell me how to test it, and **wait for my explicit "OK"** before starting the next phase. Do not start the next phase "just to save time".
3. **Never invent requirements.** If something is ambiguous or missing (especially in the design folder), **ask me** instead of guessing.
4. **Never modify the `design/` folder.** It is read-only input.
5. **Production quality only.** No placeholder code, no `TODO`s left behind, no fake data in the UI, no commented-out blocks, no `console.log` debugging left in.
6. **Keep it simple and readable.** This will be read and graded by a professor. Prefer clear code over clever code. Small files, clear names, short comments where the *why* is not obvious.
7. **If a phase needs a change to something built in an earlier approved phase**, tell me first, then do it and note it in the report.
8. **Git:** commit at the end of each phase with a message like `phase 3: events API`. One phase = one commit (or a small set).

---

## 1. Project overview

**EventHub** is a web application (PERN stack: PostgreSQL, Express, React, Node.js) to manage:

- **events** (creation, publication)
- **participants**
- **registrations** (participants registering to events)
- a simple **dashboard** with statistics

### Roles

| Role | Rights |
|---|---|
| `admin` | Full management: events, users, participants, registrations |
| `staff` | Manage events, participants and registrations. **No user management.** |

Participants do **not** log in. They are data records managed by staff/admin.

---

## 2. Required deliverables (from the test brief)

You must deliver all of these in the end:

1. **Conception**: ERD / design doc, tables + PK/FK, constraints, recommended indexes (already done by me: see `docs/` if provided).
2. **Backend**: REST API Node.js + Express, input validation, JWT authentication.
3. **Frontend**: React (Vite), functional interface (list / details / creation).
4. **PostgreSQL**: SQL script or migrations.
5. **README**: installation + environment variables + commands.
6. **Seed data**.
7. *Bonus:* Docker Compose, Swagger/OpenAPI, backend tests (Jest/Supertest), pagination.

---

## 3. Tech stack (fixed)

| Layer | Choice |
|---|---|
| Runtime | Node.js (LTS) |
| Backend | Express |
| DB | PostgreSQL, accessed with `pg` (node-postgres), **raw parameterized SQL, no ORM** |
| Auth | `jsonwebtoken` + `bcrypt` |
| Validation | **Zod** |
| Security | `helmet`, `cors`, `express-rate-limit` |
| Config | `dotenv` |
| Frontend | React + Vite, `react-router-dom`, `axios` (or fetch wrapper) |
| Styling | Follow `design/DESIGN.md` (Tailwind allowed only if the design file says so or I approve) |
| Tests (bonus) | Jest + Supertest |
| Docs (bonus) | `swagger-ui-express` + OpenAPI file |

Do not add other major libraries without asking me.

---

## 4. Folder structure

### 4.1 Repository root

```
eventhub/
├── AGENT_INSTRUCTIONS.md        ← this file
├── README.md                    ← final deliverable (phase 10)
├── docker-compose.yml           ← bonus
├── design/                      ← READ-ONLY, provided by me
│   ├── DESIGN.md                ← design system (colors, fonts, components, rules)
│   └── screens/                 ← one image/file per screen
├── docs/
│   ├── conception/              ← ERD + conception document (provided by me)
│   └── progress/                ← YOU write one report per phase here
│       ├── PHASE-01.md
│       └── ...
├── backend/
└── frontend/
```

### 4.2 Backend architecture (mandatory)

Layered architecture: **routes → controllers → services → db**. Keep each layer in its own folder.

```
backend/
├── package.json
├── .env.example
├── migrations/
│   └── 001_init.sql
├── seeds/
│   └── seed.js
├── scripts/
│   ├── migrate.js               ← runs migrations
│   └── seed.js entry (or npm script calling seeds/seed.js)
├── src/
│   ├── server.js                ← ONLY starts the HTTP server (listen, graceful shutdown)
│   ├── app.js                   ← creates the Express app: middlewares, routes, error handler
│   ├── config/
│   │   ├── env.js               ← loads + validates env variables (fail fast if missing)
│   │   └── db.js                ← pg Pool + helper (query, getClient/transaction)
│   ├── routes/
│   │   ├── index.js             ← mounts all routers under /api
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── events.routes.js
│   │   ├── participants.routes.js
│   │   ├── registrations.routes.js
│   │   └── dashboard.routes.js
│   ├── controllers/             ← HTTP only: read req, call service, send res. NO SQL, NO business rules.
│   │   ├── auth.controller.js
│   │   └── ...
│   ├── services/                ← business rules + SQL queries + transactions
│   │   ├── auth.service.js
│   │   └── ...
│   ├── middlewares/
│   │   ├── authenticate.js      ← verifies JWT, sets req.user
│   │   ├── authorize.js         ← role check: authorize('admin')
│   │   ├── validate.js          ← runs a Zod schema on body/query/params
│   │   ├── rateLimiters.js
│   │   ├── notFound.js          ← 404 for unknown routes
│   │   └── errorHandler.js      ← central error → JSON response
│   ├── validators/              ← Zod schemas (auth, events, participants, registrations, ...)
│   └── utils/
│       ├── AppError.js          ← custom error class (statusCode, code, message, details)
│       ├── asyncHandler.js      ← wraps async controllers
│       └── constants.js         ← roles, statuses, transitions
└── tests/                       ← bonus
```

Rules:

- **Controllers never contain SQL or business rules.** Services never touch `req`/`res`.
- All errors are thrown as `AppError` and handled in **one** `errorHandler`.
- All DB access goes through `config/db.js` with **parameterized queries only** (`$1, $2`).
- Business rules that need atomicity run inside a **transaction**.

### 4.3 Frontend architecture

```
frontend/
├── package.json
├── .env.example                 ← VITE_API_URL
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx                  ← router definition
    ├── api/                     ← axios instance (+ auth interceptor) and one file per resource
    ├── context/AuthContext.jsx  ← user, token, login, logout
    ├── routes/ProtectedRoute.jsx (and RoleRoute if needed)
    ├── layouts/                 ← AppLayout (sidebar + header), AuthLayout
    ├── pages/                   ← LoginPage, DashboardPage, EventsPage, EventDetailsPage, EventFormPage, ParticipantsPage, RegisterParticipantPage
    ├── components/              ← reusable UI (Button, Input, Badge, Table, Modal, Toast, Pagination, ProgressBar, EmptyState, ...)
    ├── hooks/                   ← useDebounce, useFetch, ...
    ├── utils/                   ← formatDate, constants
    └── styles/                  ← design tokens from DESIGN.md
```

---

## 5. Database (PostgreSQL)

Use **UUID** primary keys (`gen_random_uuid()`; enable `pgcrypto` or use PG 13+). Provide everything in `migrations/001_init.sql` (idempotent where reasonable) and a runner script `npm run migrate`.

### 5.1 Tables

**users**
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| full_name | varchar(150) | NOT NULL |
| email | varchar(255) | NOT NULL, UNIQUE (store lowercase) |
| password_hash | varchar(255) | NOT NULL |
| role | varchar(10) | NOT NULL, CHECK in ('admin','staff'), default 'staff' |
| created_at | timestamptz | NOT NULL, default now() |

**events**
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| title | varchar(200) | NOT NULL |
| description | text | nullable |
| location | varchar(255) | NOT NULL |
| event_date | timestamptz | NOT NULL |
| max_participants | integer | NOT NULL, CHECK > 0 |
| status | varchar(10) | NOT NULL, CHECK in ('draft','published','cancelled'), default 'draft' |
| created_by | uuid | NOT NULL, FK → users(id) ON DELETE RESTRICT |
| created_at | timestamptz | NOT NULL, default now() |
| updated_at | timestamptz | NOT NULL, default now() |

**participants**
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| full_name | varchar(150) | NOT NULL |
| email | varchar(255) | NOT NULL, UNIQUE (store lowercase) |
| phone | varchar(30) | nullable |
| created_at | timestamptz | NOT NULL, default now() |

**registrations**
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| event_id | uuid | NOT NULL, FK → events(id) ON DELETE CASCADE |
| participant_id | uuid | NOT NULL, FK → participants(id) ON DELETE CASCADE |
| status | varchar(10) | NOT NULL, CHECK in ('pending','confirmed','cancelled'), default 'pending' |
| created_at | timestamptz | NOT NULL, default now() |
| | | **UNIQUE (event_id, participant_id)** |

### 5.2 Indexes

- `events(status)`, `events(event_date)`
- `registrations(event_id, status)`, `registrations(participant_id)`, `registrations(created_at)`
- `participants`: trigram GIN index on `full_name` and `email` (`pg_trgm`) for search
- UNIQUE constraints already index `users.email`, `participants.email`, `registrations(event_id, participant_id)`

### 5.3 Seed data (mandatory)

`npm run seed` must insert (and be re-runnable: clear then insert, or upsert):

- **1 admin + 1 staff** (passwords hashed with bcrypt in the seed script). Document the dev credentials in the README.
- **5 events** with a mix of statuses: at least 2 `published`, 1 `draft`, 1 `cancelled`, and 1 published event that is **nearly full or full** (small `max_participants`).
- **10 participants** (varied, realistic names; some Moroccan, some international).
- **20 registrations** with different statuses. Rules for seed consistency: never exceed capacity on any event, no registration on a `draft` event, **all registrations of the cancelled event must be `cancelled`**, and put a few registrations dated **today** so the dashboard "registrations today" is not empty.

---

## 6. Business rules (MANDATORY, enforce in services, not in controllers)

| # | Rule | Enforcement |
|---|---|---|
| R1 | **Cannot register a participant on a non-published event** (draft or cancelled) | Service checks `events.status = 'published'`, else 409 with clear message |
| R2 | **A participant cannot register twice to the same event** | DB UNIQUE constraint; map Postgres error `23505` to 409 |
| R3 | **Never exceed `max_participants`**: if full, block the registration | In a **transaction**: `SELECT ... FOR UPDATE` on the event row, count registrations with status `pending` or `confirmed`, reject with 409 if count ≥ max |
| R4 | **When an event becomes `cancelled`, all its registrations become `cancelled`** | One transaction: update event + `UPDATE registrations SET status='cancelled' WHERE event_id=$1` |
| R5 | `participants.email` is unique | DB UNIQUE → 409 |

Additional decisions (implement exactly):

- Cancelled registrations **do not count** toward capacity.
- Re-registering after a cancellation: the UNIQUE constraint prevents a second row, so **reactivate the existing cancelled row** (`cancelled → pending`) and re-run R1 and R3 checks.
- **Event status transitions:** `draft → published`, `draft → cancelled`, `published → cancelled`. `cancelled` is final. No unpublishing. Anything else → 400/409.
- **Registration status transitions:** `pending → confirmed`, `pending → cancelled`, `confirmed → cancelled`. Anything else → 400/409. Confirming a registration must also be blocked if its event is not `published`.
- `max_participants` cannot be updated below the current number of active (`pending` + `confirmed`) registrations.
- Editing a `cancelled` event is not allowed.
- Always lowercase + trim emails before saving/searching.

---

## 7. API specification

Base path: `/api`. JSON only. All routes except `POST /api/auth/login` require a valid JWT (`Authorization: Bearer <token>`).

### 7.1 Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | body `{ email, password }` → `{ token, user }`. Generic error message on failure ("Invalid credentials"), never reveal which part was wrong. |
| GET | `/api/auth/me` | returns current user (never include `password_hash`) |

### 7.2 Events
| Method | Path | Notes |
|---|---|---|
| POST | `/api/events` | create (status forced to `draft`, `created_by` = current user) |
| GET | `/api/events?status=&date=` | list; `status` filter; `date=YYYY-MM-DD` matches events on that day. Include `registered_count` per event. |
| GET | `/api/events/:id` | detail, with `registered_count` |
| PUT | `/api/events/:id` | update fields |
| PATCH | `/api/events/:id/status` | body `{ status }`: publish / cancel, validates transitions, applies R4 |

### 7.3 Participants
| Method | Path | Notes |
|---|---|---|
| POST | `/api/participants` | create |
| GET | `/api/participants?search=` | search by `full_name` OR `email` (case-insensitive, parameterized `ILIKE`) |
| GET | `/api/participants/:id` | detail (extra, useful for the UI) |
| PUT | `/api/participants/:id` | update |
| DELETE | `/api/participants/:id` | needed for full CRUD (brief says "CRUD participants") |

### 7.4 Registrations
| Method | Path | Notes |
|---|---|---|
| POST | `/api/registrations` | body `{ eventId, participantId }`; applies R1, R2, R3 |
| GET | `/api/registrations?eventId=&status=` | list with participant info (name, email) and event title joined |
| PATCH | `/api/registrations/:id/status` | body `{ status }`; validates transitions |

### 7.5 Dashboard
| Method | Path | Returns |
|---|---|---|
| GET | `/api/dashboard` | `totalEvents`, `publishedEvents`, `registrationsToday`, `topEvents` (top 5 most filled: `id, title, maxParticipants, registered, fillRate`) |

Top 5 = published events ordered by fill rate (active registrations ÷ max), then by registered count.

### 7.6 Users (admin only, "gestion complète… utilisateurs")
| Method | Path |
|---|---|
| GET | `/api/users` |
| POST | `/api/users` (admin creates a user with a role) |
| PUT | `/api/users/:id` |
| DELETE | `/api/users/:id` (cannot delete yourself; blocked if the user created events, return a clear 409) |

If the design has no users screen, build the API only and tell me.

### 7.7 Role matrix

| Endpoint group | admin | staff |
|---|---|---|
| auth | ✔ | ✔ |
| events, participants, registrations, dashboard | ✔ | ✔ |
| users | ✔ | ✘ (403) |

### 7.8 Error format (always the same)

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable message", "details": [ { "field": "email", "message": "Invalid email" } ] } }
```

| Status | When |
|---|---|
| 400 | Validation error, invalid UUID, invalid status transition |
| 401 | Missing / invalid / expired token, bad login |
| 403 | Role not allowed |
| 404 | Resource or route not found |
| 409 | Duplicate (email, registration), event full, event not published |
| 500 | Unexpected error (generic message, never leak stack traces or SQL) |

---

## 8. Security requirements (MANDATORY)

**Backend**
- Passwords hashed with **bcrypt** (cost ≥ 12). Never log or return `password_hash`.
- **JWT**: secret from env (min 32 chars, fail at startup if missing/weak), short expiry (e.g. `2h`), payload minimal (`sub`, `role`). Verify the user still exists on `/auth/me` (and ideally in `authenticate`).
- **Authorization** enforced server-side with `authorize(...)` middleware. Never trust the frontend.
- **Input validation** with Zod on body, query and params for **every** route (types, lengths, enums, UUID format, email format, `event_date` valid, `max_participants` integer > 0). Strip unknown fields.
- **SQL injection:** parameterized queries only. Never concatenate user input into SQL.
- **`helmet`** enabled. **CORS** restricted to the frontend origin from env (no `*`).
- **Rate limiting:** strict limit on `POST /api/auth/login` (e.g. 10 attempts / 15 min / IP) + a general limit on `/api`.
- Limit JSON body size (e.g. `10kb`). Disable `x-powered-by`.
- Central error handler: no stack traces in responses when `NODE_ENV=production`.
- No secrets in git: `.env` in `.gitignore`, provide `.env.example`.
- Graceful shutdown (close pool on SIGTERM/SIGINT).

**Frontend**
- Token sent as `Authorization: Bearer`. Store it in `localStorage` (note the XSS trade-off in the README) and clear it on logout or any `401`.
- Protected routes redirect to login; role-restricted pages/buttons hidden for staff (server still enforces).
- Never use `dangerouslySetInnerHTML`. Escape/validate all inputs; client-side validation mirrors server rules but the server is the authority.
- No secrets in the frontend; only `VITE_API_URL`.

---

## 9. Frontend requirements

**Mandatory pages:**
1. **Login**
2. **Dashboard** (total events, published events, registrations today, top 5 most filled events)
3. **Events list + filters** (status, date)
4. **Event details** (with the **list of registrations**, status actions, publish / cancel with confirmation)
5. **Participants page** (list, search by name or email, create, edit, delete)
6. **Registration form: participant → event**
7. **Create / edit event form** (list / details / creation is explicitly required)

Behavior requirements:
- Loading states, empty states, error states and success toasts on every data screen.
- Show backend errors clearly (e.g. "Event is full", "Participant already registered", "Event is not published").
- Forms validate before submit and show field errors.
- Cancelling an event requires a confirmation modal warning that all registrations will be cancelled.
- Responsive down to tablet at least.

### 9.1 Design source of truth

- Read `design/DESIGN.md` **fully** and look at **every file** in `design/screens/` before writing any frontend code.
- Reproduce the design faithfully: colors, typography, spacing, radius, components, layouts, states.
- Put colors, fonts and spacing in **design tokens** (CSS variables / Tailwind theme) once, then reuse. **No hard-coded colors scattered in components.**
- If a screen needed by the brief is missing from `design/screens/`, **ask me**. Do not improvise a different style.
- If the design and the brief conflict, the brief's functionality wins and the design's visuals win; tell me about the conflict.

---

## 10. Environment variables

`backend/.env.example`
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/eventhub
JWT_SECRET=change-me-to-a-long-random-string-of-32+chars
JWT_EXPIRES_IN=2h
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

`frontend/.env.example`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 11. Code quality rules

- ES modules or CommonJS: pick one and be consistent across the backend.
- Naming: `camelCase` in JS and API JSON, `snake_case` in SQL. Map between them in services (return camelCase from the API: `eventDate`, `maxParticipants`, `createdBy`, `eventId`, `participantId`, as in the brief).
- One responsibility per file. No file over ~250 lines without a reason.
- Handle every async error (`asyncHandler`).
- Add `npm` scripts: backend `dev`, `start`, `migrate`, `seed`, `test`; frontend `dev`, `build`, `preview`.
- Use ESLint + Prettier if quick to set up; do not spend a phase on tooling.

---

## 12. Build phases (STOP after each one and wait for my "OK")

### Phase 1: Project setup
- Create the repo structure (section 4), `package.json` files, `.gitignore`, `.env.example` files.
- Backend skeleton: `server.js`, `app.js`, `config/env.js`, `config/db.js`, `GET /api/health`, `notFound`, `errorHandler`, `AppError`, `asyncHandler`.
- Frontend: Vite + React scaffold only, plus `react-router-dom` installed. No UI yet.
- **Done when:** both apps start, `/api/health` responds, DB connection is verified.

### Phase 2: Database
- `migrations/001_init.sql` (tables, constraints, indexes, `pg_trgm`), `scripts/migrate.js`.
- `seeds/seed.js` with the seed plan (section 5.3).
- **Done when:** `npm run migrate && npm run seed` work from an empty database, and I can inspect the data.

### Phase 3: Authentication & security base
- `auth.routes/controller/service`, `authenticate`, `authorize`, `validate`, rate limiters, helmet, CORS.
- `POST /auth/login`, `GET /auth/me`.
- **Done when:** login works for seed admin and staff, wrong credentials → 401, no token → 401, invalid body → 400.

### Phase 4: Events API
- All event endpoints (7.2) with validation, filters and status transitions, including R4.
- **Done when:** create → publish → cancel flow works and cancelling cascades to registrations.

### Phase 5: Participants API
- All participant endpoints (7.3), search, duplicate email → 409.

### Phase 6: Registrations API + Dashboard
- Registration endpoints (7.4) with **R1, R2, R3**, reactivation, transitions.
- `GET /api/dashboard`.
- **Done when:** I can prove each rule: non-published → blocked, duplicate → 409, full → 409 (also under two simultaneous requests), event cancel → registrations cancelled.

### Phase 7: Users API (admin) + backend hardening review
- Users endpoints (7.6) admin-only.
- Run through the security checklist (section 8) and fix gaps.
- Provide a ready-to-import **Postman/Insomnia collection or `.http` file** covering every endpoint and every error case.

### Phase 8: Frontend foundation
- Read `design/DESIGN.md` + all screens. Implement design tokens, base components, `AppLayout`, `AuthLayout`, API client, `AuthContext`, `ProtectedRoute`.
- **Login page** working end-to-end.

### Phase 9: Frontend: Dashboard + Events
- Dashboard, Events list + filters, Event details (with registrations list and actions), Create/Edit event form.

### Phase 10: Frontend: Participants + Registration form
- Participants page (list, search, create, edit, delete) and the registration form with the three error states (not published / full / already registered).
- Users admin screen if the design provides one.

### Phase 11: Finalization
- **README.md**: description, stack, prerequisites, installation, env variables, commands (migrate, seed, dev, build, test), seed credentials, project structure, API summary, business rules, security notes (incl. the localStorage trade-off), screenshots if possible.
- Final audit against section 15.

### Phase 12: Bonus (only after I approve; do them one by one)
- 12a. Pagination on events and registrations (`?page=&limit=`, return `{ data, meta: { page, limit, total, totalPages } }`) + UI pagination.
- 12b. Swagger / OpenAPI at `/api/docs`.
- 12c. Backend tests with Jest + Supertest (auth, business rules R1-R4, validation, authorization).
- 12d. `docker-compose.yml` (postgres + backend + frontend), with healthchecks and env wiring; migrations run automatically.

---

## 13. Phase report (MANDATORY after every phase)

Create `docs/progress/PHASE-XX.md` (XX = phase number) with this exact template:

```markdown
# Phase XX: <name>

**Date:** <date>
**Status:** Ready for review

## 1. What was built
- Short bullet list of features done.

## 2. Files created / modified
| File | Purpose |
|---|---|
| backend/src/... | ... |

## 3. How to run and test
Exact commands, with expected results (curl / .http examples, URLs to open).

## 4. Decisions & assumptions
- Anything I chose that was not explicitly specified, and why.

## 5. Deviations from the instructions
- None / list (with reason).

## 6. Requirement checklist for this phase
- [x] ...
- [ ] ... (with explanation if not done)

## 7. Known limitations / questions for the reviewer
- ...

## 8. Next phase
- Name and what it will contain. **Waiting for approval.**
```

Then, in the chat, give me a **short summary** (what's done, how to test, any question) and **wait**.
Also keep `docs/progress/CHANGELOG.md` updated with one line per phase.

---

## 14. Rules for handling my feedback

- When I review a phase and ask for changes, fix them **within that phase**, update its report (add a "Revision" section), and ask for approval again.
- Do not touch later phases until I say "OK".
- If my request conflicts with this file, tell me and ask which one wins.

---

## 15. Final acceptance checklist (verify at phase 11)

**Functional (from the brief)**
- [ ] Roles `admin` and `staff` work; staff cannot manage users
- [ ] `POST /api/auth/login`, `GET /api/auth/me`
- [ ] Events: create, edit, publish (draft → published), list + filter by status, detail
- [ ] Event fields: title, description, location, eventDate (date+time), maxParticipants, status (draft/published/cancelled), createdBy
- [ ] Participants: full CRUD, search by fullName or email, email unique, phone optional, createdAt
- [ ] Registrations: eventId, participantId, status (pending/confirmed/cancelled), createdAt; N-N
- [ ] **R1** cannot register on a non-published event
- [ ] **R2** no double registration
- [ ] **R3** capacity respected (race-condition safe)
- [ ] **R4** cancelling an event cancels all its registrations
- [ ] Dashboard: total events, published events, registrations today, top 5 most filled
- [ ] All endpoints of the minimal API exist (events, participants, registrations)
- [ ] Frontend pages: Login, Dashboard, Events list + filters, Event details (+ registrations list), Participants, Registration form

**Technical**
- [ ] Node + Express, controllers / routes / services / middlewares layout
- [ ] JWT + bcrypt
- [ ] Zod validation on every route
- [ ] Clear error handling (400 / 401 / 403 / 404 / 409 / 500) in a consistent format
- [ ] PostgreSQL with UUID, UNIQUE / NOT NULL / CHECK, FKs, useful indexes
- [ ] SQL migrations + seed (1 admin, 1 staff, 5 events, 10 participants, 20 registrations)
- [ ] React + Vite, REST consumption, UI faithful to `design/`
- [ ] README complete: installation, env variables, commands

**Security**
- [ ] helmet, restricted CORS, rate limiting (login stricter), body size limit
- [ ] Parameterized SQL only, no password hash ever returned
- [ ] Server-side role checks, JWT secret from env, no secrets committed

**Bonus (if approved)**
- [ ] Docker Compose · [ ] Swagger/OpenAPI · [ ] Jest/Supertest tests · [ ] Pagination

---

## 16. First action

1. Read this file, `docs/conception/` (if present), `design/DESIGN.md` and every file in `design/screens/`.
2. Reply with a **short summary of your understanding** (5-10 lines), list any **questions or missing items** (e.g. missing screens), and propose nothing else.
3. **Wait for my OK to start Phase 1.**
