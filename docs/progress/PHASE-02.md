# Phase 02: Database

**Date:** 2026-10-06
**Status:** Ready for review

## 1. What was built
- Added PostgreSQL migration `001_init.sql` with UUID primary keys, foreign keys, checks, unique constraints, extensions, and all required indexes.
- Added a migration runner that wraps the schema setup in a transaction.
- Added a repeatable seed that clears and repopulates the database with 2 users, 5 events, 10 participants, and 20 registrations.
- Added bcrypt for password hashing in seed data.

## 2. Files created / modified
| File | Purpose |
|---|---|
| backend/migrations/001_init.sql | Creates extensions, tables, constraints, and indexes. |
| backend/scripts/migrate.js | Runs the initial SQL migration safely. |
| backend/seeds/seed.js | Inserts deterministic, internally consistent development seed data. |
| backend/scripts/seed.js | Provides the `npm run seed` entry point. |
| backend/package.json | Adds bcrypt for seed password hashing. |
| backend/package-lock.json | Locks the bcrypt dependency tree. |

## 3. How to run and test
1. In `backend/`, ensure `.env` contains a valid `DATABASE_URL`.
2. Run `npm run migrate`.
3. Run `npm run seed`.
4. Run `npm run migrate` and `npm run seed` again; both must complete successfully on the populated database.
5. Expected data: 2 users, 5 events, 10 participants, and 20 registrations.
6. Development credentials created by the seed: `kenza.benjelloun@eventhub.ma` / `EventHub2025!` (admin) and `rachid.elidrissi@eventhub.ma` / `EventHub2025!` (staff).

## 4. Decisions & assumptions
- Seed event dates are generated relative to the time of seeding so that the sample remains useful over time.
- The seed clears only the four application tables before inserting data, which makes it repeatable while preserving database extensions and schema.
- The password is intentionally limited to local development seed data and will be documented in the final README.

## 5. Deviations from the instructions
- None.

## 6. Requirement checklist for this phase
- [x] UUID generation is enabled with `pgcrypto`.
- [x] `users`, `events`, `participants`, and `registrations` tables have the specified columns, keys, and constraints.
- [x] Required standard and trigram indexes are created with `pg_trgm`.
- [x] `npm run migrate` works on an empty and already migrated database.
- [x] Seed hashes the admin and staff passwords using bcrypt cost 12.
- [x] Seed inserts 1 admin, 1 staff, 5 events, 10 participants, and 20 registrations.
- [x] Seed includes published, draft, and cancelled events; the cancelled event has only cancelled registrations.
- [x] Seed respects capacity and includes registrations created today.
- [x] `npm run seed` is repeatable.

## 7. Known limitations / questions for the reviewer
- None.

## 8. Next phase
- Phase 03: Authentication and security base. **Waiting for approval.**
