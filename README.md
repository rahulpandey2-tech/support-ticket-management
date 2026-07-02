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
cd backend
npm install
cp .env.example .env    # Windows: copy .env.example .env
# Edit .env if needed (defaults work for local dev)
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env    # Windows: copy .env.example .env
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
| `DATABASE_URL` | Prisma SQLite connection string | `file:./dev.db` |
| `CORS_ORIGIN` | Allowed frontend origin (used in Step 1.5) | `http://localhost:5173` |

```bash
cd backend
copy .env.example .env
```

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |

```bash
cd frontend
copy .env.example .env
```

> Vite only exposes variables prefixed with `VITE_` to the client.

---

## Running the Application

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Runs at `http://localhost:3001` — health check at `GET /api/health`

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Runs at `http://localhost:5173` — calls backend health check on load

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
