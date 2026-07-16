# Prompt History

> How I used Cursor to build the Support Ticket Management System — requirements clarified **step by step**, not by pasting the whole exercise document.

---

## Session style

Each session I told Cursor **one slice** of what I needed: an entity, one endpoint, one UI screen, or one bug. I kept `project-context.md` and `spec.md` in the repo so I did not re-paste the full brief every time.

---

## Day 1 — Scope and entities

**Me:**
> Initialize git for this project — .gitignore for node_modules, .env, dist. I'll commit step by step.

**Outcome:** `.gitignore` created.

**Debug:** Terminal said `git` not recognized on Windows. Installed Git for Windows manually, reopened terminal, then `git init` and remote `rahulpandey2-tech/support-ticket-management` worked.

---

**Me:**
> I'm building a small internal support ticket app. Three entities: User, Ticket, Comment. Users are seeded in the database only — no signup screen. Help me list the fields each entity needs.

**Cursor:** Drafted User (name, email, role), Ticket (title, description, priority, status, assignee, creator, timestamps), Comment (ticketId, message, author, createdAt).

**I changed:** Used ObjectId/MongoDB later instead of integer ids.

---

**Me:**
> New tickets always start as `open`. Priority is low, medium, or high. Status values are open, in_progress, resolved, closed, cancelled. Write this into requirements-analysis.md.

**Outcome:** Entity section in requirements doc.

---

**Me:**
> Important rule: changing status is NOT the same as editing title. Status must use a separate API and follow a state machine. I'll give you the allowed moves next.

**Outcome:** Documented in requirements + spec.

---

**Me:**
> State machine rules:
> - open → in_progress OR cancelled
> - in_progress → resolved OR cancelled
> - resolved → closed only
> - closed and cancelled are terminal
> Invalid transitions must return 400 from backend. Confirm you understand before we code.

**Cursor:** Confirmed 5 valid transitions.

**I rejected:** Suggestion to add "reopen" from closed — not in my requirements.

---

**Me:**
> Core features I need: create ticket, list tickets, view detail, edit title/description/priority/assignee, change status via machine, add comments, search by keyword, filter by status. No login for Core. Out of scope: user CRUD UI, pagination, auth.

**Outcome:** Feature list in requirements-analysis.md.

---

**Me:**
> Help me write acceptance criteria in Given/When/Then for each feature above. Separate criteria for backend state machine tests and for UI only showing valid status buttons.

**Outcome:** `acceptance-criteria.md`.

---

**Me:**
> Stack: React + Vite + TypeScript frontend, Express + TypeScript backend, MongoDB with Mongoose. Create project-context.md with folder layout and API error format `{ error, details? }`.

**Outcome:** `project-context.md`.

---

**Me:**
> Write a phased implementation plan — small steps, one API or one page per step. Save as IMPLEMENTATION_PLAN.md. I'll follow it one commit at a time.

**Outcome:** Implementation plan (also copied to `implementation-plan.md` for submission).

---

**Me:**
> tool-workflow.md — document how I use Cursor for all 11 Part A sections (context, planning, validation, what not to share with AI).

**Outcome:** Part A submission doc.

---

**Me:**
> cursor-rules-or-instructions.md — rules for AI: one step per commit, backend enforces state machine, never commit secrets, update tasks.md after each step.

**Outcome:** Cursor rules file.

---

## Day 1 — Project setup

**Me:**
> Scaffold backend: express, typescript, tsx dev script. One route GET /api/health returns { status: "ok" }.

**Outcome:** Backend skeleton.

---

**Me:**
> Scaffold frontend with Vite react-ts. Fetch health endpoint on load, show connected or error. API URL from VITE_API_URL env var.

**Outcome:** Frontend skeleton.

---

**Me:**
> Add CORS so only http://localhost:5173 can call the API. cors package, CORS_ORIGIN in .env.

**Outcome:** CORS configured.

---

**Me:**
> .env.example for backend and frontend. Never put real credentials in example files — placeholders only.

**Outcome:** Env templates + root `.gitignore`.

---

## Day 1 — Database

**Me:**
> I started with SQLite/Prisma in early docs but switching to MongoDB + Mongoose now. Remove Prisma if any files exist. Add config/database.ts with connect, disconnect, syncIndexes.

**Outcome:** MongoDB connection layer.

---
> Mongoose User schema — email unique, role enum admin agent user. Ticket schema with refs to User for assignedTo and createdBy. Comment schema with ticketId ref.

**Outcome:** Three models.

---

**Me:**
> Ticket needs text index on title and description for search later. Also index status and updatedAt for list sorting.

**Outcome:** Indexes on Ticket model.

---

**Me:**
> Seed script: 5 users with @example.com emails, 10 tickets with mixed statuses, 8 comments. npm run seed should clear collections first.

**Outcome:** `seed.ts`.

---

**Me:**
> Script npm run verify:db — connect, syncIndexes, print status.

**Outcome:** `verifyDb.ts`.

---

### Debug — Atlas connection

**Me:**
> verify:db error: querySrv ECONNREFUSED for mongodb+srv URI. Windows 11. I didn't paste my password — what should I check?

**Cursor:** Try standard mongodb:// URI, IP whitelist, URL-encode password in .env locally.

**Fix:** Used Direct Connection string from Atlas UI.

---

**Me:**
> Connected but database name is "test". My URI ends with .net/?retryWrites — where do I put the database name?

**Fix:** `/support_tickets` before the `?`.

---

**Me:**
> npm run verify:persistence — script to print user/ticket/comment counts so I can confirm data survives after stopping the node server.

**Outcome:** `verifyPersistence.ts`.

**Note:** Counts were wrong until database name in URI was fixed (see above).

---

## Day 2 — Backend foundation

**Me:**
> AppError class with statusCode. badRequest() and notFound() helpers. errorHandler middleware returns JSON { error, details? }.

**Outcome:** Error layer.

---

**Me:**
> Zod middleware: validateBody, validateQuery, validateParams. Store parsed values on req.validated — do not overwrite req.query (I heard Express 5 makes it read-only).

**Outcome:** validate.ts (this prevented a later bug).

---

**Me:**
> Route files: tickets.ts, users.ts, comments nested under tickets. Mount at /api.

**Outcome:** Router structure.

---

**Me:**
> asyncHandler wrapper for controllers so async errors reach errorHandler. toTicketResponse mapper — convert mongoose doc to API JSON with populated user summaries.

**Outcome:** `asyncHandler.ts`, `mappers.ts`.

---

## Day 2 — APIs (one endpoint per session)

**Me:**
> GET /api/tickets — return all tickets, populate assignee and creator name/email/role, sort by updatedAt descending. Service + controller pattern.

**Outcome:** List endpoint.

---

**Me:**
> GET /api/tickets/:id — include comments array, newest first. 404 if missing.

**Outcome:** Detail endpoint.

---

**Me:**
> POST /api/tickets — body title, description, priority, createdById required, assignedToId optional. Always create with status open. 201 response.

**Outcome:** Create endpoint.

---

**Me:**
> POST /api/tickets returns 400 on createdById — strengthen objectIdSchema in Zod to validate 24-char hex MongoDB id format.

**Fix:** `validators/common.ts` ObjectId pattern.

---

**Me:**
> PATCH /api/tickets/:id — only title, description, priority, assignedToId. If someone sends status in body, Zod schema must not include it.

**Outcome:** Update endpoint.

**I verified:** status not in updateTicketSchema.

---

**Me:**
> statusMachine.ts — canTransition(from,to) for the 5 edges we defined. getAllowedTransitions(from). getInvalidTransitionMessage for 400 responses.

**Outcome:** State machine module.

---

**Me:**
> PATCH /api/tickets/:id/status — use canTransition, 400 with "Cannot transition from X to Y" if invalid.

**Outcome:** Status endpoint.

---

**Me:**
> GET /api/tickets/:id/allowed-transitions — return currentStatus and allowedTransitions array for UI buttons.

**Outcome:** Helper endpoint.

---

**Me:**
> POST /api/tickets/:ticketId/comments — message and createdById required, ticket must exist.

**Outcome:** Comments endpoint.

---

**Me:**
> Add ?q= to list tickets using MongoDB text search. Add ?status= filter. Both query params work together.

**Outcome:** Search + filter.

---

**Me:**
> GET /api/users — list all seeded users for dropdowns. Return id, name, email, role.

**Outcome:** Users endpoint.

---

### Debug — filter crash

**Me:**
> GET /api/tickets?status=open crashes:
> `Cannot set property query of #<IncomingMessage> which has only a getter`
> validate.ts line 25. Express 5.2. Fix to use req.validated only.

**Fix:** Stopped assigning to req.query; updated all controllers.

---

## Day 2 — Manual API test (state machine)

**Me:**
> Small script to test transitions against localhost:3001 — open to in_progress, invalid open to closed, etc. I'll run seed first.

**Outcome:** `testStateMachine.ts`, documented in testing-notes.

---

## Day 3 — Frontend (one page at a time)

**Me:**
> Add react-router-dom. Routes: / list, /tickets/new, /tickets/:id. Layout with header nav links.

**Outcome:** Router + Layout.

---

**Me:**
> api.ts — functions for listTickets, getTicket, createTicket, updateTicket, updateTicketStatus, getAllowedTransitions, createComment, listUsers. Throw ApiError with backend message on failure.

**Outcome:** API client.

---

**Me:**
> TicketListPage — table columns title, status, priority, assignee, updated. Link title to detail. Loading state.

**Outcome:** List page.

---

**Me:**
> Add status dropdown on list — refetch with ?status= when changed.

**Outcome:** Status filter UI.

---

**Me:**
> Search box with 300ms debounce, pass ?q= to API. Keep status filter when searching.

**Outcome:** Search UI.

---

**Me:**
> CreateTicketPage — form fields title, description, priority, assignee, createdBy. Load users for dropdowns. Show validation errors from API details array. Redirect to detail on success.

**Outcome:** Create page.

---

**Me:**
> TicketDetailPage read-only first — show all fields, comments list, 404 state.

**Outcome:** Detail view.

---

**Me:**
> Add edit mode on detail — save calls PATCH /tickets/:id. Cancel resets. Success banner.

**Outcome:** Edit feature.

---

**Me:**
> Status section: call allowed-transitions API, show button per allowed status. On 400 show error banner, don't update badge until success.

**Outcome:** Status UI wired to state machine.

---

**Me:**
> Comments — list from ticket, form to add comment, POST then refetch ticket.

**Outcome:** Comments UI.

---

**Me:**
> Shared UI components — ErrorBanner for API errors, EmptyState for no tickets/no comments, LoadingSpinner, StatusBadge with color per status. Keep styling simple in App.css.

**Outcome:** `components/` folder + error/empty/loading polish.

---

### Debug — frontend build

**Me:**
> npm run build error: FormEvent must be type-only import. CreateTicketPage and TicketDetailPage.

**Fix:** `import { type FormEvent } from 'react'`.

---

**Me:**
> Browser CORS error calling API. Backend has cors — what env var?

**Fix:** CORS_ORIGIN=http://localhost:5173 in backend .env.

---

**Me:**
> Duplicate TicketResponse types in frontend/src/types — match backend enums and api shapes. No shared package for Core.

**Outcome:** Frontend types module.

---

## Day 4 — Testing and polish

**Me:**
> Extract express app to app.ts for supertest. index.ts only starts server.

**Outcome:** Testable app export.

---

**Me:**
> Jest + supertest + mongodb-memory-server. Integration tests: each valid transition, each invalid transition with exact error message, create validation, search filter.

**Outcome:** 16 tests.

---

**Me:**
> 13 pass 3 fail — third suite can't start memory server in 10s. Probably starting 3 servers. Fix setup only.

**Fix:** globalSetup / globalTeardown.

---

**Me:**
> Jest hangs after pass — open handles. disconnect mongoose in afterAll? forceExit ok?

**Fix:** Both.

---

**Me:**
> backend npm run build fails because tsc compiles test files and errors on beforeAll. Exclude src/tests from production tsconfig.

**Fix:** `"exclude": ["src/tests"]` in tsconfig.json.

---

**Me:**
> smokeTest.ts — API flow create list detail edit status comment. For manual regression with server running.

**Outcome:** Smoke script.

---

**Me:**
> grep repo for secrets — .env.example has real atlas hostname. replace with placeholder.

**Fix:** localhost URI in example file. Also added `.env` to `frontend/.gitignore`.

---

**Me:**
> Run self code review against spec and acceptance criteria. Document in code-review-notes.md — what's good, what's tech debt, what we fixed.

**Outcome:** Code review doc + `review-fixes.md`.

---

**Me:**
> README — complete prerequisites, run instructions, npm test, troubleshooting table for Atlas and CORS.

**Outcome:** Full README.

---

## Day 5 — Submission docs

**Me:**
> Compare our folder layout to the exercise submission structure. We're missing api-contract.md, data-model.md, ui-flow.md at root, and database/setup-notes.md. Create them from our spec without duplicating everything.

**Outcome:** Root structure aligned — see REPOSITORY_STRUCTURE.md.

---

**Me:**
> debugging-notes.md — one section per bug: atlas srv, wrong db name, express query, jest memory server, env example secrets.

**Outcome:** Debugging doc.

---

**Me:**
> reflection.md and pr-description.md for submission. Honest about AI mistakes.

**Outcome:** Lifecycle artifacts.

---

**Me:**
> Mark all Core acceptance criteria as verified in acceptance-criteria.md. candidate-info.md with my name, stack, repo link.

**Outcome:** Submission metadata files.

---

## Coverage checklist

Use this to confirm prompt history matches everything built.

### Planning & requirements
- [x] Entities (User, Ticket, Comment)
- [x] State machine (5 transitions)
- [x] Core features vs out of scope
- [x] Acceptance criteria (Given/When/Then)
- [x] project-context, spec, implementation plan
- [x] tool-workflow.md (Part A)
- [x] cursor-rules
- [x] Git init + remote

### Backend development
- [x] Health check + CORS
- [x] Mongoose models + indexes
- [x] Seed + verify:db + verify:persistence
- [x] AppError + errorHandler
- [x] Zod validation + req.validated
- [x] asyncHandler + mappers
- [x] GET list / GET detail / POST create / PATCH update
- [x] PATCH status + state machine + allowed-transitions
- [x] POST comments + GET users
- [x] Search ?q= + filter ?status= combined

### Frontend development
- [x] Router + Layout + API client + types
- [x] Ticket list + status filter + debounced search
- [x] Create ticket + validation errors
- [x] Detail view + 404
- [x] Edit mode + success feedback
- [x] Status buttons (allowed transitions only)
- [x] Comments list + add form
- [x] ErrorBanner, EmptyState, LoadingSpinner, StatusBadge

### Debugging (all issues in debugging-notes.md)
- [x] Git not on PATH
- [x] Atlas querySrv ECONNREFUSED
- [x] Wrong database name (test vs support_tickets)
- [x] Express 5 req.query read-only
- [x] ObjectId validation on create
- [x] FormEvent type-only import
- [x] CORS env var
- [x] Secrets in .env.example
- [x] frontend .gitignore .env
- [x] Jest Memory Server timeout
- [x] Jest hang / open handles
- [x] tsconfig excluding tests from build

### Testing
- [x] testStateMachine.ts (manual API)
- [x] smokeTest.ts (E2E API)
- [x] Jest integration (16 tests)
- [x] testing-notes.md documentation

### Documentation & submission
- [x] code-review-notes + review-fixes
- [x] debugging-notes, reflection, pr-description
- [x] api-contract, data-model, ui-flow at root
- [x] REPOSITORY_STRUCTURE alignment
- [x] candidate-info + AC checkboxes

---

| Anti-pattern | Why avoided |
|--------------|-------------|
| Paste entire participant guide into chat | Used repo docs as persistent context instead |
| "Build entire backend in one prompt" | One endpoint per session |
| "Build all UI pages at once" | List → create → detail → edit → status → comments separately |
| Paste real .env credentials | Only error messages and redacted URIs in prompts |

---

## Approximate session count

| Area | Sessions |
|------|----------|
| Requirements & planning | 11 |
| Backend APIs & foundation | 18 |
| Database & seed | 8 |
| Debugging | 12 |
| Frontend | 14 |
| Tests | 9 |
| Documentation & review | 9 |
| **Total** | **~81** |

---

*Grouped by activity: [`ai-prompts/`](../ai-prompts/) · Structure: [`REPOSITORY_STRUCTURE.md`](../REPOSITORY_STRUCTURE.md)*
