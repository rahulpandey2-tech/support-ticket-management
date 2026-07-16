# Reflection — Support Ticket Management System

## What I Built

A full-stack support ticket app where internal users can create tickets, search and filter them, edit details, add comments, and move tickets through a strict five-transition state machine. The backend enforces all status rules; the frontend only offers valid next statuses and surfaces backend errors clearly.

Stack: React + Vite, Express 5 + TypeScript, MongoDB Atlas + Mongoose, Jest + Supertest for integration tests.

---

## How I Used AI Across the Lifecycle

| Phase | AI role | My role |
|-------|---------|---------|
| **Requirements** | Drafted structure for requirements doc and implementation plan | Verified state machine rules and Core scope against exercise brief |
| **Planning** | Generated spec, tasks, acceptance criteria templates | Chose unified search/filter API; decided MongoDB over SQLite |
| **Implementation** | One step at a time — routes, services, pages | Reviewed every diff; rejected full-phase dumps |
| **Debugging** | Suggested fixes for Atlas DNS, Express 5 query issue | Reproduced errors locally before applying fixes |
| **Testing** | Wrote Jest/Supertest suites and smoke scripts | Ran tests; fixed Memory Server startup flakiness |
| **Review** | Security scan found credentials in `.env.example` | Rotated approach; fixed gitignore |
| **Documentation** | Drafted README, debugging notes, reflection | Edited for accuracy and honesty |

---

## What AI Helped With Most

1. **Boilerplate speed** — Express route structure, Mongoose schemas, React page scaffolding
2. **Test generation** — Integration tests from acceptance criteria saved hours
3. **Error interpretation** — Express 5 `req.query` read-only issue diagnosed quickly from stack trace
4. **Documentation** — Consistent markdown artifacts (spec, testing notes, code review)

---

## What AI Got Wrong

1. **Initial stack assumption** — Early docs referenced Prisma/SQLite; I switched to MongoDB/Mongoose and had to update context
2. **Validation middleware** — First version reassigned `req.query`, which breaks Express 5
3. **`.env.example`** — AI once used a real Atlas URI from my local `.env` pattern — caught in security review
4. **Jest setup** — Per-file Memory Server caused timeouts; needed global setup refactor
5. **Over-generation** — Sometimes tried to do whole phases at once; I constrained to one step per prompt

---

## How I Validated AI Output

- Ran `npm run dev` after every backend change
- Used `curl` / smoke scripts before wiring frontend
- `npm test` after Phase 8 — all 16 tests must pass
- Manual UI walkthrough for create → list → detail → edit → status → comment
- Grep repo for secrets before submission
- Read generated code for state machine bypass (e.g. status in generic PATCH)

---

## What Was Hard

- **Atlas connectivity on Windows** — SRV DNS issues took time; standard URI fixed it
- **State machine as Core centerpiece** — Getting backend enforcement + frontend UX + tests aligned
- **Lifecycle artifacts** — The app is small; the documentation volume is large — easy to deprioritize
- **Prompt history discipline** — Logging every session while building is tedious but valuable

---

## What I Would Improve Next

1. **Shared types package** between frontend and backend
2. **E2E tests** with Playwright for UI flows
3. **CI pipeline** — GitHub Actions running `npm test` on every push
4. **Auth** — JWT + role-based access for Stretch
5. **Earlier test setup** — Jest in Phase 5 alongside state machine, not Phase 8

---

## Reusable Workflow

1. Create `project-context.md` + `spec.md` before coding
2. Work one implementation-plan step per session
3. Log prompts with what you accepted vs changed
4. Never commit without running locally
5. Backend owns business rules — always
6. Security grep before final submission

This workflow transferred well from the exercise to how I'd use Cursor on a real team project.
