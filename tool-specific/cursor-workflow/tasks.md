# Tasks — Support Ticket Management System

> Track progress against [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).  
> Update status as you complete each step: `done` · `in-progress` · `pending`

**Last updated:** Step 1.2 complete

---

## Phase 0 — Planning & AI Workflow Artifacts

| Step | Task | Status |
|------|------|--------|
| 0.1 | Create Git repository + `.gitignore` + initial commit | done |
| 0.2 | Write `docs/requirements-analysis.md` | done |
| 0.3 | Create `tool-specific/cursor-workflow/project-context.md` | done |
| 0.4 | Create `tool-specific/cursor-workflow/spec.md` | done |
| 0.5 | Create `tool-specific/cursor-workflow/tasks.md` | done |
| 0.6 | Create `tool-specific/cursor-workflow/acceptance-criteria.md` | done |
| 0.7 | Create `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` | done |
| 0.8 | Create `tool-workflow.md` (Part A) | done |
| 0.9 | Start `prompts/prompt-history.md` | done |

---

## Phase 1 — Project Scaffolding

| Step | Task | Status |
|------|------|--------|
| 1.1 | Root `README.md` skeleton | done |
| 1.2 | Scaffold backend (Express + TypeScript) | done |
| 1.3 | Scaffold frontend (React + Vite + TS) | pending |
| 1.4 | Environment variables (`.env.example`) | pending |
| 1.5 | Health check + CORS | pending |

---

## Phase 2 — Database Setup

| Step | Task | Status |
|------|------|--------|
| 2.1 | Install Prisma + SQLite config | pending |
| 2.2 | Define User model | pending |
| 2.3 | Define Ticket model | pending |
| 2.4 | Define Comment model | pending |
| 2.5 | Run initial migration | pending |
| 2.6 | Create seed script | pending |
| 2.7 | Verify persistence after restart | pending |

---

## Phase 3 — Backend Foundation

| Step | Task | Status |
|------|------|--------|
| 3.1 | Shared types and enums | pending |
| 3.2 | Error handling middleware | pending |
| 3.3 | Validation layer (Zod) | pending |
| 3.4 | API router structure | pending |

---

## Phase 4 — Backend APIs

| Step | Task | Status |
|------|------|--------|
| 4.1 | `GET /api/tickets` — list all | pending |
| 4.2 | `GET /api/tickets/:id` — detail + comments | pending |
| 4.3 | `POST /api/tickets` — create | pending |
| 4.4 | `PATCH /api/tickets/:id` — update fields | pending |
| 4.5 | `PATCH /api/tickets/:id/status` — change status | pending |
| 4.6 | `POST /api/tickets/:id/comments` — add comment | pending |
| 4.7 | Keyword search (`?q=`) | pending |
| 4.8 | Filter by status (`?status=`) | pending |
| 4.9 | Combined search + status filter | pending |
| 4.10 | `GET /api/users` — list seeded users | pending |

---

## Phase 5 — Status State Machine

| Step | Task | Status |
|------|------|--------|
| 5.1 | `statusMachine.ts` — transition map + helpers | pending |
| 5.2 | Integrate state machine into status API | pending |
| 5.3 | `GET /api/tickets/:id/allowed-transitions` | pending |
| 5.4 | Manual API tests documented | pending |

---

## Phase 6 — Frontend

| Step | Task | Status |
|------|------|--------|
| 6.1 | Router + API client + types | pending |
| 6.2 | Layout and navigation | pending |
| 6.3 | Ticket List page | pending |
| 6.4 | Status filter on list | pending |
| 6.5 | Keyword search on list | pending |
| 6.6 | Create Ticket page | pending |
| 6.7 | Ticket Detail view | pending |
| 6.8 | Edit ticket fields | pending |
| 6.9 | Status change UI | pending |
| 6.10 | Comments section | pending |
| 6.11 | Error and empty states | pending |

---

## Phase 7 — Integration & Polish

| Step | Task | Status |
|------|------|--------|
| 7.1 | End-to-end smoke test documented | pending |
| 7.2 | README setup instructions complete | pending |
| 7.3 | Code review pass + notes | pending |
| 7.4 | Security check (no secrets) | pending |

---

## Phase 8 — Testing

| Step | Task | Status |
|------|------|--------|
| 8.1 | Test infrastructure (Jest + Supertest) | pending |
| 8.2 | Valid status transition integration tests | pending |
| 8.3 | Invalid status transition integration tests | pending |
| 8.4 | Create ticket validation tests | pending |
| 8.5 | Search and filter integration tests | pending |
| 8.6 | Run full suite + document results | pending |

---

## Phase 9 — Documentation & Lifecycle Artifacts

| Step | Task | Status |
|------|------|--------|
| 9.1 | Finalize `tool-workflow.md` | pending |
| 9.2 | Sync cursor-workflow docs with implementation | pending |
| 9.3 | Complete prompt history | pending |
| 9.4 | `docs/debugging-notes.md` | pending |
| 9.5 | `docs/reflection.md` | pending |
| 9.6 | `docs/PR_DESCRIPTION.md` | pending |
| 9.7 | `docs/design.md` | pending |

---

## Phase 10 — Submission

| Step | Task | Status |
|------|------|--------|
| 10.1 | Pre-submission verification | pending |
| 10.2 | Push repository to GitHub | pending |
| 10.3 | Fill submission form | pending |
| 10.4 | Submit and keep repo available | pending |

---

## Phase 11 — Stretch (Optional)

| Step | Task | Status |
|------|------|--------|
| 11.1 | Filter by priority + assignee | pending |
| 11.2 | Sorting + pagination | pending |
| 11.3 | User CRUD + role management | pending |
| 11.4 | Authentication (JWT/session) | pending |
| 11.5 | Unit tests for state machine | pending |
| 11.6 | Edge-case / failure tests | pending |
| 11.7 | Swagger / OpenAPI | pending |
| 11.8 | Docker Compose | pending |
| 11.9 | CI workflow (GitHub Actions) | pending |
| 11.10 | Reusable prompt templates | pending |

---

## Progress summary

| Phase | Done | Total |
|-------|------|-------|
| Phase 0 | 9 | 9 |
| Phase 1–10 | 0 | 58 |
| Phase 11 (optional) | 0 | 10 |

**Next step:** 1.3 — Scaffold frontend (React + Vite + TS)

---

*Document: Step 0.5 — Task tracker. Update status after each completed step.*
