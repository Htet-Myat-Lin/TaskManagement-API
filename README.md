# Task Manager API (Backend)

A small Express + Prisma (MariaDB) API for managing members and tasks.

**Status:** Development

---

## Quick Start

- **Install dependencies:**

```bash
cd backend
npm install
```

- **Run in development:**

```bash
npm run dev
```

The server uses `process.env.PORT` (set via `.env`). By default CORS allows `http://localhost:7000`.

---

## Environment variables
Create a `.env` file in the `backend` folder with at least the following variables:

- `PORT` — port the Express server listens on (e.g. `5000`)
- `IMAGE_PART` - http://localhost:5000/uploads/
- `DATABASE_URL` - DB url
- `DATABASE_PORT` - DB port
- `DATABASE_HOST` — MariaDB host (e.g. `localhost`)
- `DATABASE_USER` — DB user
- `DATABASE_PASSWORD` — DB password
- `DATABASE_NAME` — DB name

---

## Database (Prisma)

This project uses Prisma with the MariaDB adapter. The Prisma schema and migration files are under the `prisma/` folder and generated client is in `generated/prisma`.

Typical Prisma workflow:

```bash
# generate client
npx prisma generate --schema=./prisma/schema.prisma

# create/apply migrations (development)
npx prisma migrate dev --schema=./prisma/schema.prisma --name init
```

If you need to inspect the database, use `npx prisma studio`.

---

## API Overview

Base URL: `http://localhost:<PORT>/api/v1`

Static files:

- Uploads are served from `/uploads` and the `uploads/` folder is used for storing uploaded files.

### Members

- `GET /api/v1/members` — list members (supports query params)
- `POST /api/v1/members` — create a member (multipart/form-data, optional `profileImage` file)
- `PATCH /api/v1/members/:id` — update a member (multipart/form-data, optional `profileImage` file)
- `DELETE /api/v1/members/:id` — delete a member
- `DELETE /api/v1/members/bulk-delete` — bulk delete members

### Tasks

- `GET /api/v1/tasks` — list tasks
- `POST /api/v1/tasks` — create a task (JSON)
- `PATCH /api/v1/tasks/:id` — update a task (JSON)
- `DELETE /api/v1/tasks/:id` — delete a task
- `DELETE /api/v1/tasks/bulk-delete` — bulk delete tasks
- `PATCH /api/v1/tasks/bulk-status-update` — update status for multiple tasks
- `GET /api/v1/tasks/status-count` — returns task counts by status
- `GET /api/v1/tasks/:status` — list tasks filtered by status

---

## Project structure (important files)

- `src/app.ts` — Express app and route mounting
- `src/lib/prisma.ts` — Prisma client initialization (reads `DATABASE_*` env vars)
- `src/features/members` — member controllers, routes, validation
- `src/features/tasks` — task controllers, routes, validation
- `src/uploads/` — uploaded files (served from `/uploads`)
- `prisma/` — Prisma schema and migrations
- `generated/prisma/` — generated Prisma client

