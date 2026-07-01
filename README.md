# Support Ticket Management System

A full-stack internal application for creating, managing, searching, and progressing support tickets through a backend-enforced status lifecycle.

Built as part of the **JS AI Capability Exercise** using **Cursor** for AI-assisted development.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite + Prisma |
| Testing | Jest + Supertest |

---

## Prerequisites

<!-- TODO: Step 7.2 — add Node.js version, npm, and any other requirements -->

- _To be completed_

---

## Project Structure

```
C1_PROJECT/
├── frontend/          # React SPA
├── backend/           # Express API + Prisma
├── docs/              # Lifecycle artifacts
├── prompts/           # AI prompt history
└── tool-specific/     # Cursor workflow docs
```

---

## Setup

<!-- TODO: Step 7.2 — add full clone, install, migrate, and seed instructions -->

### 1. Clone the repository

```bash
# TODO
```

### 2. Backend setup

```bash
# TODO: install, env, migrate, seed
```

### 3. Frontend setup

```bash
# TODO: install
```

---

## Environment Variables

<!-- TODO: Step 1.4 — add .env.example and document variables -->

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `3001` |
| `DATABASE_URL` | Prisma SQLite connection | `file:./dev.db` |
| `CORS_ORIGIN` | Frontend dev URL | `http://localhost:5173` |

Copy `backend/.env.example` to `backend/.env` and adjust values locally. **Never commit `.env`.**

---

## Running the Application

<!-- TODO: Step 1.5+ — add run commands once backend and frontend exist -->

### Backend

```bash
# TODO: cd backend && npm run dev
```

### Frontend

```bash
# TODO: cd frontend && npm run dev
```

---

## Running Tests

<!-- TODO: Step 8.1 — add test command and notes -->

```bash
# TODO: cd backend && npm test
```

---

## Core Features

- Create, list, view, and update support tickets
- Status state machine (backend enforced)
- Comments on tickets
- Keyword search and filter by status
- Integration tests for state machine rules

---

## Documentation

| Document | Description |
|----------|-------------|
| [Implementation Plan](./IMPLEMENTATION_PLAN.md) | Step-by-step build guide |
| [Requirements Analysis](./docs/requirements-analysis.md) | Business requirements |
| [Tool Workflow](./tool-workflow.md) | AI workflow (Part A) |
| [Project Context](./tool-specific/cursor-workflow/project-context.md) | Cursor persistent context |
| [Spec](./tool-specific/cursor-workflow/spec.md) | API and UI specification |
| [Tasks](./tool-specific/cursor-workflow/tasks.md) | Progress tracker |

---

## License

<!-- Optional -->

_Internal exercise project._
