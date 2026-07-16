# Tasks — Support Ticket Management System

> Track progress against [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).  
> Update status as you complete each step: `done` · `in-progress` · `pending`

**Last updated:** Phase 9 complete — ready for submission verification  
**Next step:** 10.1 — Pre-submission verification

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
| 1.3 | Scaffold frontend (React + Vite + TS) | done |
| 1.4 | Environment variables (`.env.example`) | done |
| 1.5 | Health check + CORS | done |

---

## Phase 2 — Database Setup

| Step | Task | Status |
|------|------|--------|
| 2.1 | Install Mongoose + MongoDB config | done |
| 2.2 | Define User model (Mongoose) | done |
| 2.3 | Define Ticket model (Mongoose) | done |
| 2.4 | Define Comment model (Mongoose) | done |
| 2.5 | Verify MongoDB connection and indexes | done |
| 2.6 | Create seed script | done |
| 2.7 | Verify persistence after restart | done |

---

## Phase 3 — Backend Foundation

| Step | Task | Status |
|------|------|--------|
| 3.1 | Shared types and enums | done |
| 3.2 | Error handling middleware | done |
| 3.3 | Validation layer (Zod) | done |
| 3.4 | API router structure | done |

---

## Phase 4 — Backend APIs

| Step | Task | Status |
|------|------|--------|
| 4.1 | `GET /api/tickets` — list all | done |
| 4.2 | `GET /api/tickets/:id` — detail + comments | done |
| 4.3 | `POST /api/tickets` — create | done |
| 4.4 | `PATCH /api/tickets/:id` — update fields | done |
| 4.5 | `PATCH /api/tickets/:id/status` — change status | done |
| 4.6 | `POST /api/tickets/:id/comments` — add comment | done |
| 4.7 | Keyword search (`?q=`) | done |
| 4.8 | Filter by status (`?status=`) | done |
| 4.9 | Combined search + status filter | done |
| 4.10 | `GET /api/users` — list seeded users | done |

---

## Phase 5 — Status State Machine

| Step | Task | Status |
|------|------|--------|
| 5.1 | `statusMachine.ts` — transition map + helpers | done |
| 5.2 | Integrate state machine into status API | done |
| 5.3 | `GET /api/tickets/:id/allowed-transitions` | done |
| 5.4 | Manual API tests documented | done |

---

## Phase 6 — Frontend

| Step | Task | Status |
|------|------|--------|
| 6.1 | Router + API client + types | done |
| 6.2 | Layout and navigation | done |
| 6.3 | Ticket List page | done |
| 6.4 | Status filter on list | done |
| 6.5 | Keyword search on list | done |
| 6.6 | Create Ticket page | done |
| 6.7 | Ticket Detail view | done |
| 6.8 | Edit ticket fields | done |
| 6.9 | Status change UI | done |
| 6.10 | Comments section | done |
| 6.11 | Error and empty states | done |

---

## Phase 7 — Integration & Polish

| Step | Task | Status |
|------|------|--------|
| 7.1 | End-to-end smoke test documented | done |
| 7.2 | README setup instructions complete | done |
| 7.3 | Code review pass + notes | done |
| 7.4 | Security check (no secrets) | done |

---

## Phase 8 — Testing

| Step | Task | Status |
|------|------|--------|
| 8.1 | Test infrastructure (Jest + Supertest) | done |
| 8.2 | Valid status transition integration tests | done |
| 8.3 | Invalid status transition integration tests | done |
| 8.4 | Create ticket validation tests | done |
| 8.5 | Search and filter integration tests | done |
| 8.6 | Run full suite + document results | done |

---

## Phase 9 — Documentation & Lifecycle Artifacts

| Step | Task | Status |
|------|------|--------|
| 9.1 | Finalize `tool-workflow.md` | done |
| 9.2 | Sync cursor-workflow docs with implementation | done |
| 9.3 | Complete prompt history | done |
| 9.4 | `docs/debugging-notes.md` | done |
| 9.5 | `docs/reflection.md` | done |
| 9.6 | `docs/PR_DESCRIPTION.md` | done |
| 9.7 | `docs/design.md` | done |

---

## Phase 10 — Submission

| Step | Task | Status |
|------|------|--------|
| 10.1 | Pre-submission verification | in-progress |
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
| Phase 1 | 5 | 5 |
| Phase 2 | 7 | 7 |
| Phase 3 | 4 | 4 |
| Phase 4 | 10 | 10 |
| Phase 5 | 4 | 4 |
| Phase 6 | 11 | 11 |
| Phase 7 | 4 | 4 |
| Phase 8 | 6 | 6 |
| Phase 9 | 7 | 7 |
| Phase 10 | 0 | 4 |
| Phase 11 (optional) | 0 | 10 |

---

*Document: Step 0.5 — Task tracker. Update status after each completed step.*
