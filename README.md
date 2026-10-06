# EventHub

EventHub is a PERN back-office application for managing events, participants, registrations, and event operations reporting.

## Requirements

- Node.js 20 or later
- PostgreSQL 14 or later

## Setup

1. Create a PostgreSQL database named `eventhub`.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and a long `JWT_SECRET`.
3. Copy `frontend/.env.example` to `frontend/.env` if the API runs somewhere other than `http://localhost:5000/api`.
4. Install dependencies:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

5. Create the schema and demo data:

   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

6. Start the API and frontend in separate terminals:

   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

Open the address shown by Vite, normally `http://localhost:5173`.

## Docker Compose

With Docker Desktop running, start the full stack (PostgreSQL, backend, and frontend) from the project root:

```bash
docker compose up --build -d
```

The frontend is available at `http://localhost:5173`; the API is available at `http://localhost:5000/api`. The backend automatically applies migrations and loads the demo data, so the documented admin and staff accounts are ready as soon as the stack starts. This Docker setup is intended for the demo: each backend restart resets the EventHub data to the clean seeded dataset.

To stop the stack, run `docker compose down`. Database data is kept in the `eventhub_postgres_data` Docker volume. To remove that data for a completely fresh database, run `docker compose down -v`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `kenza.benjelloun@eventhub.ma` | `EventHub2025!` |
| Staff | `rachid.elidrissi@eventhub.ma` | `EventHub2025!` |

Admin can manage events, participants, users, and registrations. Staff can manage events and registrations and can read the participant directory while creating registrations.

## API overview

- `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/events`, `GET/PUT /api/events/:id`, `PATCH /api/events/:id/status`
- `GET/POST /api/participants`, `GET/PUT/DELETE /api/participants/:id`
- `GET/POST /api/registrations`, `PATCH /api/registrations/:id/status`
- `GET /api/dashboard`
- `GET/POST /api/users`, `PUT/DELETE /api/users/:id` (admin only)

## Business rules

- Only published events accept registrations.
- Pending and confirmed registrations reserve capacity; cancelled registrations do not.
- A participant can have only one registration per event.
- Cancelling an event cancels all of its registrations.

## Database design

The migration at `backend/migrations/001_init.sql` creates `users`, `events`, `participants`, and `registrations`, with foreign keys, uniqueness constraints, checks, and performance indexes. The visual design document is available at `docs/conception/EventHub-Conception-FR.pdf`.
