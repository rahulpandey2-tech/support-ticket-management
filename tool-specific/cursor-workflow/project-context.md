# Project Context — Support Ticket Management System

> Persistent context for Cursor AI sessions. Reference this file at the start of each implementation step.  
> Source of truth for requirements: [`docs/requirements-analysis.md`](../../docs/requirements-analysis.md)

---

## 1. Project Overview

| Item | Value |
|------|-------|
| **Project name** | Support Ticket Management System |
| **Exercise** | JS AI Capability Exercise — Part B (Core) |
| **Primary AI tool** | Cursor |
| **Repository** | `support-ticket-management` |
| **Goal** | Full-stack app to create, manage, search, and progress support tickets through a backend-enforced status lifecycle |

---

## 2. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React 18 + Vite + TypeScript | SPA with client-side routing |
| Styling | CSS Modules (or Tailwind) | Keep UI simple and readable |
| Backend | Node.js + Express + TypeScript | REST API |
| Database | MongoDB | Document database; local or Atlas |
| ODM | Mongoose | Schemas, models, and seed scripts |
| Validation | Zod | Request body validation on backend |
| Testing | Jest + Supertest | Integration tests for API and state machine |
| HTTP client | `fetch` | Frontend → backend calls |

### Environment variables (backend)

| Variable | Example | Purpose |
|----------|---------|---------|
| `PORT` | `3001` | API server port |
| `MONGODB_URI` | `mongodb://localhost:27017/support_tickets` | MongoDB connection string |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend dev server origin |

Secrets (e.g. future JWT secret) go in `.env` only — never commit.

---

## 3. Repository Structure

```
C1_PROJECT/
├── README.md
├── tool-workflow.md
├── IMPLEMENTATION_PLAN.md
├── .gitignore
├── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (TicketCard, StatusBadge, etc.)
│   │   ├── pages/          # TicketListPage, CreateTicketPage, TicketDetailPage
│   │   ├── services/       # api.ts — HTTP calls to backend
│   │   ├── types/          # Shared TS interfaces
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # Express routers
│   │   ├── controllers/    # Request/response handling
│   │   ├── services/       # Business logic (statusMachine.ts)
│   │   ├── validators/     # Zod schemas
│   │   ├── middleware/       # errorHandler, etc.
│   │   └── index.ts
│   │   ├── models/         # Mongoose models (User, Ticket, Comment)
│   │   ├── config/         # database.ts — MongoDB connection
│   ├── tests/              # Integration tests
│   └── package.json
├── docs/
│   └── requirements-analysis.md
├── prompts/
│   └── prompt-history.md
└── tool-specific/
    └── cursor-workflow/
        ├── project-context.md   ← this file
        ├── spec.md
        ├── tasks.md
        ├── acceptance-criteria.md
        └── cursor-rules-or-instructions.md
```

---

## 4. Domain Model

### 4.1 User (seeded — no user-management UI in Core)

```
User {
  id: number
  name: string
  email: string        // unique
  role: 'admin' | 'agent' | 'user'
}
```

- Created via seed script only.
- Exposed via `GET /api/users` for assignee dropdowns.
- Core has **no login** — UI uses seeded user as `createdBy`.

### 4.2 Ticket

```
Ticket {
  id: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: TicketStatus
  assignedToId: number | null
  createdById: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

- New tickets always start with `status = 'open'`.
- `title` and `description` are required.
- Status **cannot** be updated via generic PATCH — only via `PATCH /api/tickets/:id/status`.

### 4.3 Comment

```
Comment {
  id: number
  ticketId: number
  message: string
  createdById: number
  createdAt: DateTime
}
```

- Append-only in Core.
- `message` must not be empty.

---

## 5. Status State Machine

**Enforce in `backend/src/services/statusMachine.ts`.** Never rely on the frontend alone.

### Allowed transitions

| From | To |
|------|-----|
| `open` | `in_progress` |
| `in_progress` | `resolved` |
| `resolved` | `closed` |
| `open` | `cancelled` |
| `in_progress` | `cancelled` |

### Terminal statuses

`closed` and `cancelled` — no outbound transitions.

### Service functions

```typescript
canTransition(from: TicketStatus, to: TicketStatus): boolean
getAllowedTransitions(from: TicketStatus): TicketStatus[]
```

### On invalid transition

- HTTP **400** (or 409)
- Body: `{ "error": "Invalid status transition from <from> to <to>" }`

---

## 6. API Conventions

### General

- Base path: `/api`
- Content-Type: `application/json`
- REST-style routes (see `spec.md` for full list)

### Success responses

| Code | When |
|------|------|
| 200 | GET, PATCH success |
| 201 | POST create success |

### Error response shape

```json
{
  "error": "Human-readable message",
  "details": []
}
```

`details` is optional (e.g. Zod validation field errors).

### HTTP status codes

| Code | When |
|------|------|
| 400 | Validation failure, invalid status transition |
| 404 | Ticket or resource not found |
| 409 | Conflict (optional for invalid transition) |
| 500 | Unexpected server error |

### Key endpoints (summary)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/tickets` | List (`?status=`, `?q=`) |
| GET | `/api/tickets/:id` | Detail + comments |
| POST | `/api/tickets` | Create |
| PATCH | `/api/tickets/:id` | Update fields (not status) |
| PATCH | `/api/tickets/:id/status` | State machine transition |
| POST | `/api/tickets/:id/comments` | Add comment |
| GET | `/api/users` | Seeded users for dropdowns |
| GET | `/api/tickets/:id/allowed-transitions` | Valid next statuses (optional) |

---

## 7. Validation Approach

- **Backend:** Zod schemas in `validators/` — validate every write endpoint before DB access.
- **Frontend:** Basic form checks for UX; always display backend error messages.
- **Enums:** Reject unknown `priority`, `status`, and invalid user IDs.
- **Status:** Validate transition via `statusMachine.ts`, not by accepting any enum value.

---

## 8. Frontend Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | TicketListPage | List, search, status filter |
| `/tickets/new` | CreateTicketPage | Create ticket form |
| `/tickets/:id` | TicketDetailPage | View, edit, status change, comments |

Core: no auth screens. `createdBy` defaults to a seeded user (e.g. first user in list).

---

## 9. Coding Standards

### Naming

| Item | Convention | Example |
|------|------------|---------|
| Files | camelCase for TS, PascalCase for React components | `statusMachine.ts`, `TicketListPage.tsx` |
| Routes | kebab or plural nouns | `/api/tickets` |
| DB collections | lowercase plural (Mongoose default) | `users`, `tickets`, `comments` |
| Enums | snake_case values in API/DB | `in_progress`, `cancelled` |

### Backend layering

```
Route → Controller → Service → Mongoose Model
```

- **Routes:** wire HTTP methods only.
- **Controllers:** parse request, call service, send response.
- **Services:** business logic (especially state machine).
- **Models:** Mongoose schemas in `src/models/`.
- **Validators:** Zod schemas in `validators/`.

### Frontend

- API calls only in `services/api.ts`.
- Types in `types/` — mirror backend shapes.
- One page component per route in `pages/`.

### Commits

- One logical step per commit (match `IMPLEMENTATION_PLAN.md`).
- Format: `feat(api): ...`, `feat(frontend): ...`, `docs: ...`, `test: ...`

### Do not

- Put status transition logic only in React.
- Allow `status` updates through generic PATCH.
- Commit `.env`, real passwords, or API keys.
- Skip backend validation.

---

## 10. Core vs Stretch

### In scope (Core)

- CRUD for tickets (create, list, detail, update fields)
- Status state machine + integration tests
- Comments, keyword search, status filter
- Seeded users, no auth

### Stretch (implement only when Core + artifacts are done)

- Authentication (JWT/session), protected routes
- User CRUD and role management
- Filter by priority/assignee, sorting, pagination
- Swagger, Docker, CI

---

## 11. What NOT to Share with AI

| Do not share | Use instead |
|--------------|-------------|
| Real `.env` values | Placeholders from `.env.example` |
| Production DB URLs | `mongodb://localhost:27017/support_tickets` |
| Real colleague emails | `user@example.com` in seeds and prompts |
| JWT secrets / API keys | `your-secret-here` placeholder |
| Company-internal URLs or confidential data | Generic descriptions |

---

## 12. Related Documents

| Document | Purpose |
|----------|---------|
| `docs/requirements-analysis.md` | Full requirements and acceptance criteria |
| `IMPLEMENTATION_PLAN.md` | Step-by-step build plan |
| `tool-specific/cursor-workflow/spec.md` | API and UI specification (Step 0.4) |
| `tool-specific/cursor-workflow/tasks.md` | Task tracker |
| `prompts/prompt-history.md` | AI prompt log |

---

*Document: Step 0.3 — Project Context. Update when stack or architecture decisions change.*
