# Support Ticket Management System

A full-stack internal application for creating, managing, searching, and progressing support tickets through a backend-enforced status lifecycle.

Built as part of the **JS AI Capability Exercise** using **Cursor** for AI-assisted development.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Testing | Jest + Supertest (Phase 8) |

---

## Prerequisites

- **Node.js** 20.x or later (LTS recommended)
- **npm** 10+ (included with Node.js)
- **MongoDB** — local instance **or** [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster
- **Git**

---

## Project Structure

```
C1_PROJECT/
├── frontend/          # React SPA
├── backend/           # Express API + Mongoose
├── docs/              # Lifecycle artifacts
├── prompts/           # AI prompt history
└── tool-specific/     # Cursor workflow docs
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/rahulpandey2-tech/support-ticket-management.git
cd support-ticket-management
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy the example env file and edit `MONGODB_URI`:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Verify database connection and sync indexes:

```bash
npm run verify:db
```

Seed sample data:

```bash
npm run seed
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

---

## Environment Variables

Environment config lives in **separate `.env` files** for backend and frontend.  
Copy each `.env.example` to `.env` in the same folder before running locally.

**Never commit `.env` files** — only `.env.example` files are tracked in git.

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/support_tickets` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

**Atlas example** (use your own credentials):

```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/support_tickets?retryWrites=true&w=majority
```

Ensure the URI includes the database name (`/support_tickets`) so data is not written to the default `test` database.

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |

> Vite only exposes variables prefixed with `VITE_` to the client.

---

## Running the Application

Open **two terminals**.

### Backend (terminal 1)

```bash
cd backend
npm run dev
```

Runs at `http://localhost:3001` — health check at `GET /api/health`

### Frontend (terminal 2)

```bash
cd frontend
npm run dev
```

Runs at `http://localhost:5173`

---

## Database Seed

After backend setup, populate sample data:

```bash
cd backend
npm run seed
```

Seeds **5 users**, **10 tickets** (various statuses/priorities), and **8 comments**.

Re-run `npm run seed` anytime to reset sample data (clears existing users, tickets, and comments).

### Verify data persistence

```bash
cd backend
npm run verify:persistence
```

Stop and restart the server, then run `verify:persistence` again — counts should match. MongoDB Atlas persists data independently of the Node.js process.

---

## Running Tests

### State machine API tests (Phase 5)

```bash
cd backend
npm run dev              # terminal 1
npm run test:state-machine   # terminal 2
```

### End-to-end API smoke test (Phase 7)

```bash
cd backend
npm run dev              # terminal 1
npm run smoke:test       # terminal 2
```

### Integration test suite (Phase 8)

```bash
cd backend
npm test
```

Uses **Jest + Supertest** with **MongoDB Memory Server** (isolated in-memory DB per run). No running server or Atlas connection required.

**Latest run (2026-07-15):** 3 suites, **16 tests passed**

| Suite | Tests |
|-------|-------|
| `statusTransitions.test.ts` | 5 valid + 5 invalid transitions |
| `tickets.create.test.ts` | Create validation (400/201) |
| `tickets.searchFilter.test.ts` | Search, filter, combined query |

### Frontend build check

```bash
cd frontend
npm run build
npm run lint
```

---

## Core Features

- Create, list, view, and update support tickets
- Status state machine (backend enforced)
- Comments on tickets
- Keyword search and filter by status
- Integration tests for state machine rules (Phase 8)

### Status transitions

| From | Allowed next |
|------|----------------|
| `open` | `in_progress`, `cancelled` |
| `in_progress` | `resolved`, `cancelled` |
| `resolved` | `closed` |
| `closed` | _(terminal)_ |
| `cancelled` | _(terminal)_ |

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tickets` | List tickets (`?status=`, `?q=`) |
| `POST` | `/api/tickets` | Create ticket |
| `GET` | `/api/tickets/:id` | Get ticket with comments |
| `PATCH` | `/api/tickets/:id` | Update fields (not status) |
| `PATCH` | `/api/tickets/:id/status` | Change status (state machine) |
| `GET` | `/api/tickets/:id/allowed-transitions` | Valid next statuses |
| `POST` | `/api/tickets/:ticketId/comments` | Add comment |
| `GET` | `/api/users` | List users (for assignee dropdowns) |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Repository Structure](./REPOSITORY_STRUCTURE.md) | Submission layout (exercise template) |
| [Implementation Plan](./implementation-plan.md) | Step-by-step build guide |
| [Requirements Analysis](./requirements-analysis.md) | Business requirements |
| [API Contract](./api-contract.md) | REST endpoint reference |
| [Data Model](./data-model.md) | Mongoose schemas |
| [UI Flow](./ui-flow.md) | Pages and user flows |
| [Testing Notes](./docs/testing-notes.md) | Manual and automated test results |
| [Test Results](./test-results.md) | Latest test run summary |
| [Test Strategy](./test-strategy.md) | What is and isn't tested |
| [Debugging Notes](./debugging-notes.md) | Bugs hit and fixes |
| [Code Review Notes](./code-review-notes.md) | Self-review findings |
| [Design Notes](./design-notes.md) | Architecture and key decisions |
| [Reflection](./reflection.md) | AI workflow reflection |
| [PR Description](./pr-description.md) | Submission PR summary |
| [Candidate Info](./candidate-info.md) | Submission metadata |
| [Prompt History](./prompts/prompt-history.md) | AI prompt log |
| [Tool Workflow](./tool-workflow.md) | AI workflow (Part A) |
| [Project Context](./tool-specific/cursor-workflow/project-context.md) | Cursor persistent context |
| [Spec](./tool-specific/cursor-workflow/spec.md) | Full API and UI specification |
| [Tasks](./tool-specific/cursor-workflow/tasks.md) | Progress tracker |
| [Database Setup](./database/setup-notes.md) | MongoDB setup and seed |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` to MongoDB | Start local MongoDB or check Atlas URI and IP whitelist |
| Database shows as `test` | Add `/support_tickets` to the end of `MONGODB_URI` |
| Frontend cannot reach API | Confirm backend is running; check `VITE_API_URL` |
| CORS errors | Set `CORS_ORIGIN=http://localhost:5173` in `backend/.env` |
| Empty ticket list after seed | Run `npm run seed` from the `backend` folder |

---

## License

_Internal exercise project._
