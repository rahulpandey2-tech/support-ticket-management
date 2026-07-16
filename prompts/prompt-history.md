# Prompt History

> Chronological log of meaningful AI prompts for the Support Ticket Management System.  
> Grouped copies also live in [`ai-prompts/`](../ai-prompts/).

---

## 2026-07-01 — Exercise setup — Implementation plan

**Goal:** Understand the exercise and get a step-by-step plan before coding.

**Prompt (actual):**
> I have the JS AI Capability Exercise participant guide. Read it carefully and create IMPLEMENTATION_PLAN.md — every step, separate API and UI steps, submission checklist. Plan only, no code yet.

**Outcome:** `IMPLEMENTATION_PLAN.md` with phases 0–11.

**Changes made:** Deleted auto-generated code from first attempt; preferred building one step at a time.

---

## 2026-07-01 — Phase 0 — Planning artifacts

**Goal:** Complete all planning docs before Phase 1.

**Prompts (actual):**
> Start with phase 0, do step 0.1 — create git repository.

> Do step 0.2 — write requirements-analysis.

> Step 0.3 — create project-context.md. Stack: React, Express, TypeScript. I'm leaning SQLite + Prisma for easy local review.

> Step 0.4 spec.md, Step 0.5 tasks.md, Step 0.6 acceptance-criteria.md — full API spec and Given/When/Then for Core.

> Step 0.7 cursor-rules, Step 0.8 tool-workflow.md, Step 0.9 prompt history.

**Outcome:** Full `tool-specific/cursor-workflow/` folder + `docs/requirements-analysis.md` + `tool-workflow.md`.

**Changes made:** Unified search/filter on one GET endpoint. Git wasn't on PATH — installed manually.

---

## 2026-07-01 — Phase 1 — Scaffolding

**Goal:** Backend + frontend skeleton with health check.

**Prompt (actual):**
> Phase 1 — scaffold backend Express TS and frontend React Vite. Health check at /api/health, CORS for 5173, .env.example, root README skeleton.

**Outcome:** `backend/`, `frontend/`, health endpoint working.

**Changes made:** None major.

---

## 2026-07-01 — Phase 2 — Database (MongoDB switch)

**Goal:** Persist data with Mongoose instead of Prisma.

**Prompt (actual):**
> Change of plan — use MongoDB with Mongoose instead of Prisma/SQLite. Add models for User, Ticket, Comment per spec. seed script with 5 users 10 tickets 8 comments, all @example.com emails. npm run verify:db to test connection.

**Outcome:** Mongoose models, `seed.ts`, `verifyDb.ts`, `verifyPersistence.ts`.

**Changes made:** Removed Prisma artifacts. Added text index on ticket title+description for search.

---

## 2026-07-01 — Debugging — Atlas won't connect

**Goal:** Fix MongoDB Atlas connection on Windows.

**Prompt (actual):**
> npm run verify:db fails:
> `querySrv ECONNREFUSED _mongodb._tcp.cluster0.xxxxx.mongodb.net`
> using mongodb+srv in .env. Windows 11. what do I try?

**Outcome:** Switched to standard `mongodb://` URI from Atlas Direct Connection.

**Changes made:** Did not paste real password in prompt. Added troubleshooting to testing-notes.

---

## 2026-07-01 — Debugging — wrong database name

**Prompt (actual):**
> connected to atlas but data is in database "test" not support_tickets. my URI ends with .net/?retryWrites=true — missing something?

**Outcome:** Added `/support_tickets` to URI path.

**Changes made:** None.

---

## 2026-07-01 — Phases 3–4 — Backend APIs

**Goal:** All REST endpoints per spec.

**Prompts (actual):**
> Phase 3 — shared types, AppError middleware, Zod validate middleware, route structure.

> Phase 4 — implement all ticket APIs one by one: list, get by id, create, patch fields, patch status with state machine, comments, search ?q=, filter ?status=, GET /users.

**Outcome:** Full backend API layer.

**Changes made:** Reviewed each endpoint against spec before next step.

---

## 2026-07-01 — Debugging — Express 5 req.query crash

**Goal:** Fix crash when calling GET /api/tickets?status=open.

**Prompt (actual):**
> API throws:
> `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`
> in validate.ts when parsing query string. Express 5.2. Fix validation middleware.

**Outcome:** `req.validated` pattern + `express.d.ts` typing.

**Changes made:** Updated all controllers to use `req.validated` — AI's first fix was correct, applied across all routes.

---

## 2026-07-01 — Phase 5 — State machine

**Goal:** Enforce transitions in backend + tests.

**Prompt (actual):**
> phase 5 — statusMachine.ts with 5 transitions, integrate into PATCH /status, GET allowed-transitions, manual test script, document in testing-notes. Error message: "Cannot transition from X to Y".

**Outcome:** `statusMachine.ts`, integration, `testStateMachine.ts`, 9/9 pass.

**Changes made:** None.

---

## 2026-07-13 — Phase 6 — Frontend

**Goal:** Complete UI for all Core features.

**Prompt (actual):**
> complete phase 6 — React Router, ticket list with status dropdown and debounced search, create ticket page, detail with edit mode, status buttons from allowed-transitions API only, comments, error banners and empty states. match backend types.

**Outcome:** Full frontend in `frontend/src/pages/`.

**Changes made:** Fixed `FormEvent` type-only import for production build.

---

## 2026-07-15 — Phase 7 — Polish & security

**Goal:** E2E docs, README, code review, no secrets.

**Prompts (actual):**
> complete phase 7

> grep repo for secrets — .env.example has real atlas URI, fix that

**Outcome:** `smokeTest.ts`, README complete, `code-review-notes.md`, `.env.example` fixed.

**Changes made:** Rotated approach to credentials — advised password rotation if ever pushed.

---

## 2026-07-15 — Phase 8 — Integration tests

**Goal:** Jest + Supertest mandatory test tier.

**Prompt (actual):**
> complete phase 8 — jest supertest mongodb-memory-server. tests for valid transitions, invalid transitions 400 with message, create validation, search filter. extract app.ts. npm test must pass.

**Follow-up prompt (actual):**
> 13 tests pass 3 fail — MongoMemoryServer failed to start within 10000ms on third test file. fix test setup only.

**Follow-up prompt (actual):**
> jest hangs after all tests pass — "did not exit one second after test run". mongoose memory server open handles.

**Outcome:** 16/16 tests, globalSetup/teardown, `--forceExit`.

**Changes made:** Refactored test infra twice — AI's per-file setup was wrong for multiple suites.

---

## 2026-07-16 — Submission readiness

**Prompt (actual):**
> here's the participant guide again — are we meeting all requirements? be honest.

**Outcome:** Gap list for Phase 9 artifacts.

**Prompt (actual):**
> okay complete all Requirement and also in prompt history, add like human add prompts for Debugging, development, testing, errors etc. give like real human add prompt

**Outcome:** This file updated + `ai-prompts/` + reflection, debugging notes, design, PR description, candidate-info.

---

## Prompts I rejected or corrected

| AI suggestion | Why rejected |
|---------------|--------------|
| Extra status transition "reopen" | Not in exercise spec |
| Status field on generic PATCH | Would bypass state machine |
| Real URI in `.env.example` | Security — placeholders only |
| Whole phase in one prompt | Too much to review; split by step |
| Prisma after MongoDB switch | Stack decision already changed |

---

*See also: [`ai-prompts/planning.md`](../ai-prompts/planning.md) · [`implementation.md`](../ai-prompts/implementation.md) · [`testing.md`](../ai-prompts/testing.md) · [`debugging.md`](../ai-prompts/debugging.md) · [`code-review.md`](../ai-prompts/code-review.md)*
