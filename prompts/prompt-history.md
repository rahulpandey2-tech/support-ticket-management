# Prompt History

> Chronological log of AI prompts used while building the Support Ticket Management System.  
> This reflects how the project was actually built — many small sessions, not a few bulk prompts.

---

## How to read this log

Each entry is one Cursor session or one focused ask.  
**Accepted** = used as-is or with minor edits · **Changed** = I modified AI output · **Rejected** = did not use

---

## 2026-07-01 (morning) — Understanding the exercise

**Prompt:**
> I need to do the JS AI Capability Exercise. Here's the participant guide [pasted]. Before writing any code, help me understand what's mandatory in Core vs what's Stretch. Especially the state machine rules — list all 5 valid transitions.

**Outcome:** Clarified Core scope; confirmed auth is optional.

**Changed:** Wrote my own summary in requirements doc later — didn't copy AI wording.

---

**Prompt:**
> Create IMPLEMENTATION_PLAN.md only — break the Support Ticket project into small steps. Separate each API endpoint and each UI page into its own step. Include phases for testing and docs. No code generation yet.

**Outcome:** First draft of `IMPLEMENTATION_PLAN.md`.

**Changed:** Removed a suggested "Day 1–7" schedule — I'm self-paced.

---

## 2026-07-01 — Phase 0 planning

**Prompt:**
> git init isn't working, terminal says git not recognized on Windows. what should I install?

**Outcome:** Installed Git for Windows manually.

**Rejected:** AI suggested WSL — stayed on native Windows.

---

**Prompt:**
> Step 0.2 — draft requirements-analysis.md for Support Ticket system. Users are seeded only, no user CRUD UI. Include edge cases for invalid status changes.

**Outcome:** `docs/requirements-analysis.md` first draft.

**Changed:** Removed "reopen closed ticket" — not in exercise brief.

---

**Prompt:**
> For project-context.md use React, Vite, Express, TypeScript. I'm thinking SQLite + Prisma so reviewers can run without installing Mongo. Agree or push back?

**Outcome:** `project-context.md` with Prisma/SQLite initially.

**Changed:** Later switched to MongoDB — see 2026-07-01 afternoon.

---

**Prompt:**
> Write spec.md for the ticket API. I want search and status filter on the same GET /api/tickets with query params ?q= and ?status=, not separate endpoints.

**Outcome:** API spec with unified list endpoint.

**Accepted:** Query param design.

---

**Prompt:**
> acceptance-criteria.md — use Given/When/Then format for every Core feature. Include separate ACs for state machine backend tests and UI behaviour.

**Outcome:** `acceptance-criteria.md`.

---

**Prompt:**
> cursor-rules-or-instructions.md — rules for AI: one step per commit, no secrets in prompts, backend must enforce status machine, validate with Zod.

**Outcome:** Cursor rules file.

---

**Prompt:**
> tool-workflow.md needs all 11 sections from Part A of the exercise. Primary tool is Cursor. Draft it based on how I plan to work.

**Outcome:** Part A submission doc.

**Changed:** Will update after I actually debug and test — not final until end.

---

## 2026-07-01 (afternoon) — Scaffolding

**Prompt:**
> Scaffold backend folder: express 5, typescript, tsx for dev. Single health route GET /api/health returns { status: "ok" }. package.json scripts for dev and build.

**Outcome:** `backend/` skeleton.

---

**Prompt:**
> Add cors middleware — only allow http://localhost:5173. Read from CORS_ORIGIN env var.

**Outcome:** CORS wired in `index.ts`.

---

**Prompt:**
> Scaffold frontend with Vite react-ts template. Add a simple App that calls /api/health and shows connected / error. Put API base URL in VITE_API_URL.

**Outcome:** `frontend/` with health check display.

---

**Prompt:**
> backend/.env.example — PORT 3001, placeholder MONGODB_URI, CORS_ORIGIN. frontend/.env.example with VITE_API_URL. Make sure .gitignore blocks .env.

**Outcome:** Env examples + gitignore.

---

## 2026-07-01 (evening) — Database decision & models

**Prompt:**
> Actually I want MongoDB Atlas instead of SQLite — easier for me to demo persistence without shipping a db file. Remove any Prisma stuff if present. Set up Mongoose connection in config/database.ts.

**Outcome:** Switched stack to Mongoose.

**Changed:** Updated project-context.md myself to say MongoDB not Prisma.

---

**Prompt:**
> Mongoose User model: name, email unique, role enum admin|agent|user. Match types in backend/src/types.

**Outcome:** `models/User.ts`.

---

**Prompt:**
> Ticket model — title max 200, description required, priority low|medium|high, status with default open, assignedTo ref User optional, createdBy ref User required. Add index on status and updatedAt.

**Outcome:** `models/Ticket.ts`.

---

**Prompt:**
> Comment model — ticketId ref Ticket, message required, createdBy ref User. Index ticketId + createdAt for listing comments on a ticket.

**Outcome:** `models/Comment.ts`.

---

**Prompt:**
> seed.ts — wipe users tickets comments then insert 5 users (@example.com only), 10 tickets covering all 5 statuses, 8 comments. npm run seed script.

**Outcome:** Seed script.

---

**Prompt:**
> npm run verify:db — script that connects, syncIndexes, prints collection index info. I need to confirm Atlas works before continuing.

**Outcome:** `verifyDb.ts`.

---

## 2026-07-01 (night) — Atlas debugging

**Prompt:**
> verify:db fails:
> ```
> querySrv ECONNREFUSED _mongodb._tcp.cluster0.sewzrz9.mongodb.net
> ```
> Using mongodb+srv URI on Windows 11. Network is fine. Ideas?

**Outcome:** AI suggested non-SRV connection string from Atlas "Drivers" panel.

**Changed:** Did NOT paste my real password in the chat — only error text.

---

**Prompt:**
> OK connected now but mongoose.connection.name is "test" not support_tickets. URI looks like ...mongodb.net/?retryWrites=true — what's missing?

**Outcome:** Need `/support_tickets` in path before query string.

**Accepted:** Fixed .env locally.

---

**Prompt:**
> seed runs but verify:persistence shows 0 tickets after I restarted only the node server. Is that expected with Atlas?

**Outcome:** Clarified Atlas keeps data; I had run seed on wrong database before URI fix.

---

## 2026-07-02 — Backend foundation

**Prompt:**
> AppError class with statusCode and optional details array. badRequest(), notFound() helpers. Central errorHandler middleware returning { error, details? }.

**Outcome:** Error handling layer.

---

**Prompt:**
> Zod validate middleware — validateBody, validateQuery, validateParams. On failure return 400 Validation failed with field messages.

**Outcome:** First version of `validate.ts`.

**Changed:** Broke later on Express 5 — see below.

---

**Prompt:**
> express.d.ts — extend Request with validated?: { body?, query?, params? }. Controllers will read from there.

**Outcome:** Type augmentation (added after Express 5 fix).

---

**Prompt:**
> Split routes: tickets.ts, comments.ts nested under tickets, users.ts. Mount at /api in routes/index.ts. Health stays on api router too.

**Outcome:** Route structure.

---

## 2026-07-02 — Ticket APIs (one at a time)

**Prompt:**
> Step 4.1 — GET /api/tickets. Service layer ticketService.listTickets(). Populate assignedTo and createdBy with name email role. Sort updatedAt desc. Response DTO without comments for list.

**Outcome:** List endpoint.

---

**Prompt:**
> list tickets crashes when I add ?status=open:
> ```
> TypeError: Cannot set property query of #<IncomingMessage> which has only a getter
> validate.ts:25
> ```
> Express 5.2.1. Don't assign to req.query — store parsed result elsewhere.

**Outcome:** `req.validated.query` pattern.

**Changed:** Updated ticketController AND commentController AND all validators consumers — AI only fixed one file first, I asked to fix all.

---

**Prompt:**
> Step 4.2 — GET /api/tickets/:id include comments array, newest comment first. 404 if not found.

**Outcome:** Detail endpoint with comments.

---

**Prompt:**
> Step 4.3 — POST /api/tickets. Body: title, description, priority, assignedToId optional, createdById required. Always create with status open. Return 201.

**Outcome:** Create endpoint.

---

**Prompt:**
> create ticket returns 400 createdById invalid — my Zod objectIdSchema — what regex/format for MongoDB ObjectId string?

**Outcome:** Adjusted `common.ts` objectId validator.

---

**Prompt:**
> Step 4.4 — PATCH /api/tickets/:id for title description priority assignedToId only. Must NOT accept status in body. At least one field required.

**Outcome:** Update endpoint without status.

**Rejected:** AI initially included status in update schema — removed it manually.

---

**Prompt:**
> Step 4.6 — POST /api/tickets/:ticketId/comments. Validate ticket exists first. Return 201 with comment DTO.

**Outcome:** Comments route.

---

**Prompt:**
> Step 4.7 — add ?q= text search on list tickets. MongoDB text index on title and description. Case insensitive behaviour?

**Outcome:** `$text` search in list filter.

**Changed:** Confirmed text index exists on Ticket schema from earlier step.

---

**Prompt:**
> Step 4.8 — ?status= filter enum. Combine with ?q= when both present (AND logic).

**Outcome:** Combined filter in `buildListFilter`.

---

**Prompt:**
> GET /api/users — return id name email role for dropdowns. No pagination needed for Core.

**Outcome:** Users list endpoint.

---

## 2026-07-02 — State machine

**Prompt:**
> statusMachine.ts — canTransition(from,to) and getAllowedTransitions(from). Only these 5 edges: open→in_progress, open→cancelled, in_progress→resolved, in_progress→cancelled, resolved→closed.

**Outcome:** Transition map.

---

**Prompt:**
> PATCH /api/tickets/:id/status — call canTransition before save. 400 with message exactly "Cannot transition from {from} to {to}".

**Outcome:** Status update endpoint.

---

**Prompt:**
> GET /api/tickets/:id/allowed-transitions — return { currentStatus, allowedTransitions: [] } for frontend buttons.

**Outcome:** Helper endpoint.

---

**Prompt:**
> Quick check — if I PATCH /api/tickets/:id with { "status": "closed" } should it work? It must NOT. Confirm updateTicketSchema excludes status.

**Outcome:** Verified safe — only status route changes status.

---

## 2026-07-02 — Manual API testing (state machine)

**Prompt:**
> Write a small node script testStateMachine.ts that hits localhost:3001 — test all valid transitions on a seeded open ticket, then test open→closed returns 400. I'll run it while dev server is up.

**Outcome:** Manual test runner.

---

**Prompt:**
> test script says no open tickets — should I re-run seed each time before manual tests?

**Outcome:** Yes — seed resets data; documented in testing-notes.

---

## 2026-07-13 — Frontend foundation

**Prompt:**
> Add react-router-dom. Routes: / list, /tickets/new create, /tickets/:id detail. Layout component with nav links.

**Outcome:** Router setup.

---

**Prompt:**
> Expand services/api.ts — listTickets with optional status and q params, getTicket, createTicket, updateTicket, updateTicketStatus, getAllowedTransitions, createComment, listUsers. Throw ApiError with backend error message on non-OK.

**Outcome:** API client.

---

**Prompt:**
> Duplicate TicketResponse and enums in frontend/src/types — match backend api.ts shapes. Don't add a shared package, keep simple for now.

**Outcome:** Frontend types.

---

## 2026-07-13 — Ticket list page

**Prompt:**
> TicketListPage — table with title status priority assignee updated date. Link title to detail. Loading spinner while fetching.

**Outcome:** Basic list UI.

---

**Prompt:**
> Add status dropdown filter — All, Open, In Progress, etc. When changed, refetch with ?status=.

**Outcome:** Status filter.

---

**Prompt:**
> Search input with debounce ~300ms, calls API with ?q=. Keep status filter when searching.

**Outcome:** `useDebounce` hook + search.

---

**Prompt:**
> Empty state when no tickets — different message when filters active vs truly empty list.

**Outcome:** `EmptyState` component.

---

## 2026-07-13 — Create ticket page

**Prompt:**
> CreateTicketPage form: title, description, priority select, assignee select from listUsers(), createdBy select defaulting to john@example.com if exists.

**Outcome:** Create form.

---

**Prompt:**
> On 400 validation error from backend show error banner and field-level messages from details array.

**Outcome:** Validation error display.

---

**Prompt:**
> After successful create redirect to /tickets/:id using navigate().

**Outcome:** Redirect on success.

---

## 2026-07-13 — Ticket detail page (multiple sessions)

**Prompt:**
> TicketDetailPage — fetch ticket by id, show title description status priority assignee createdBy dates. Back link to list. 404 friendly message if ticket not found.

**Outcome:** Read-only detail view.

---

**Prompt:**
> Edit mode toggle — form for title description priority assignee. Save calls PATCH /api/tickets/:id. Cancel resets form. Show success banner on save.

**Outcome:** Edit functionality.

---

**Prompt:**
> Status section — fetch allowed-transitions on load. Render a button per allowed status only. On click PATCH /status. If 400 show error banner with backend message, don't update UI optimistically.

**Outcome:** State machine UI.

---

**Prompt:**
> Comments section — list existing comments with author and formatted date. Form to add comment with author dropdown (default jane@example.com). POST then refetch ticket.

**Outcome:** Comments UI.

---

**Prompt:**
> StatusBadge component — color per status. formatLabel helper for in_progress → "In Progress".

**Outcome:** Shared UI components.

---

## 2026-07-13 — Frontend build fix

**Prompt:**
> frontend npm run build fails:
> `'FormEvent' is a type and must be imported using a type-only import`
> verbatimModuleSyntax is on. Fix CreateTicketPage and TicketDetailPage only.

**Outcome:** `import { type FormEvent } from 'react'`.

---

**Prompt:**
> CORS error in browser — frontend on 5173 can't reach 3001. Backend already has cors package. What env var am I missing?

**Outcome:** Set `CORS_ORIGIN=http://localhost:5173` in backend .env.

---

## 2026-07-15 — E2E & README

**Prompt:**
> smokeTest.ts script — create ticket via API, verify in list, get detail, patch title, status open→in_progress, add comment, verify comment on detail. For CI-style check with server running.

**Outcome:** Smoke script.

---

**Prompt:**
> README still has TODO placeholders for prerequisites and test commands. Fill in Node 20+, MongoDB Atlas steps, npm test, npm run seed. Windows copy commands too.

**Outcome:** Complete README.

---

**Prompt:**
> Run through acceptance criteria AC-1 to AC-14 — anything we're missing before I call Core done?

**Outcome:** Gap list — mostly docs not code.

---

## 2026-07-15 — Security review

**Prompt:**
> Review backend/.env.example — is it safe to commit? grep for mongodb+srv with real usernames in the repo.

**Outcome:** Found real Atlas username in example file.

**Changed:** Replaced with localhost placeholder. Added .env to frontend/.gitignore.

---

**Prompt:**
> code-review-notes.md — document findings from self-review. What would you flag in a PR for this ticket app?

**Outcome:** Code review doc.

---

## 2026-07-15 — Jest integration tests

**Prompt:**
> Set up Jest + Supertest in backend. Extract express app to app.ts so index.ts only starts server. Don't connect to Atlas in tests.

**Outcome:** `app.ts` split.

---

**Prompt:**
> Use mongodb-memory-server for test database. beforeEach clear all collections. syncIndexes on connect.

**Outcome:** First test setup attempt.

---

**Prompt:**
> statusTransitions.test.ts — supertest PATCH /api/tickets/:id/status. Test all 5 valid transitions each as separate it() block. Create fresh ticket per test.

**Outcome:** Valid transition tests.

---

**Prompt:**
> Add invalid cases: open→closed, open→resolved, resolved→in_progress, closed→open, cancelled→open. Expect 400 and exact error string.

**Outcome:** Invalid transition tests.

---

**Prompt:**
> tickets.create.test.ts — missing title 400, missing description 400, valid body 201.

**Outcome:** Create validation tests.

---

**Prompt:**
> search/filter test — seed tickets with known titles, query ?q=password and ?status=closed. Need helper to create test user and tickets in tests/helpers.ts.

**Outcome:** Search filter tests.

---

**Prompt:**
> 13 passed 3 failed — third test file can't start MongoMemoryServer within 10000ms. I think each test file spawns its own server. Fix test infra only.

**Outcome:** globalSetup.ts + globalTeardown.ts single memory server.

---

**Prompt:**
> jest still won't exit after tests pass — open handles from mongoose. afterAll disconnect? or forceExit acceptable for this project?

**Outcome:** disconnect in afterAll + `jest --runInBand --forceExit`.

---

**Prompt:**
> tsconfig build now includes test files and fails on beforeAll. exclude tests from production tsc build.

**Outcome:** `"exclude": ["src/tests"]` in tsconfig.

---

## 2026-07-16 — Submission docs

**Prompt:**
> Compare our repo against the full participant guide checklist. Be honest — what's missing for submission?

**Outcome:** Identified reflection, debugging notes, prompt history depth.

---

**Prompt:**
> debugging-notes.md — document Atlas SRV issue, wrong db name, Express 5 req.query, jest memory server timeout, secrets in env example. Format: problem, investigation, fix.

**Outcome:** Debugging doc.

---

**Prompt:**
> reflection.md — honest writeup: what AI helped with, what it got wrong, how I validated. Mention I switched Prisma to Mongo mid-project.

**Outcome:** Reflection.

---

**Prompt:**
> design.md with architecture diagram, why state machine is in service layer, why status has separate endpoint.

**Outcome:** Design notes.

---

**Prompt:**
> PR_DESCRIPTION.md for submission — summary, features, test plan, known limitations.

**Outcome:** PR doc.

---

**Prompt:**
> candidate-info.md with my name, stack, repo, setup summary.

**Outcome:** Candidate info.

---

**Prompt:**
> acceptance-criteria.md — mark all Core AC checkboxes verified.

**Outcome:** All [x].

---

## Things I rejected or fixed without asking again

| AI output | What I did |
|-----------|------------|
| Status on generic PATCH schema | Removed from Zod schema |
| "Reopen" transition on closed tickets | Not in spec — ignored |
| Real MongoDB URI in `.env.example` | Replaced with placeholder |
| Generate entire Phase 4 in one shot | Asked endpoint-by-endpoint instead |
| Prisma after MongoDB switch | Deleted Prisma references |
| Optimistic UI status update | Wait for API success only |

---

## Session stats (approximate)

| Metric | Count |
|--------|-------|
| Cursor sessions logged | ~55+ |
| Distinct bugs debugged with AI | 8 |
| API endpoints implemented | 9 |
| Frontend pages | 3 |
| Integration tests | 16 |

---

*Grouped prompts also in [`ai-prompts/`](../ai-prompts/). This file is the chronological source of truth.*
