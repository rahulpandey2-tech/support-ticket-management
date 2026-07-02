# Support Ticket Management System — Full Implementation Plan

> **Exercise:** JS AI Capability Exercise (Part A + B + C)  
> **Project:** Support Ticket Management System (Core mandatory, Stretch optional)  
> **Primary tool:** Cursor (submit `tool-specific/cursor-workflow/`)

This plan breaks the work into **small, sequential steps**. Each frontend page and its matching API are **separate steps** so progress is easy to track and commit.

**Estimated effort:** Core app ~8–12 hours | Lifecycle artifacts ~8–12 hours | Total ~1 week

---

## Table of Contents

1. [What You Must Submit (Checklist)](#1-what-you-must-submit-checklist)
2. [Recommended Tech Stack](#2-recommended-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Phase 0 — Planning & AI Workflow Artifacts](#phase-0--planning--ai-workflow-artifacts)
5. [Phase 1 — Project Scaffolding](#phase-1--project-scaffolding)
6. [Phase 2 — Database Setup](#phase-2--database-setup)
7. [Phase 3 — Backend Foundation](#phase-3--backend-foundation)
8. [Phase 4 — Backend APIs (One Step Per Endpoint)](#phase-4--backend-apis-one-step-per-endpoint)
9. [Phase 5 — Status State Machine](#phase-5--status-state-machine)
10. [Phase 6 — Frontend (One Step Per Page/Feature)](#phase-6--frontend-one-step-per-pagefeature)
11. [Phase 7 — Integration & Polish](#phase-7--integration--polish)
12. [Phase 8 — Testing](#phase-8--testing)
13. [Phase 9 — Documentation & Lifecycle Artifacts](#phase-9--documentation--lifecycle-artifacts)
14. [Phase 10 — Submission (Part C)](#phase-10--submission-part-c)
15. [Phase 11 — Stretch (Optional)](#phase-11--stretch-optional)
16. [Suggested Daily Schedule](#suggested-daily-schedule)
17. [Core Acceptance Criteria Tracker](#core-acceptance-criteria-tracker)

---

## 1. What You Must Submit (Checklist)

Use this as your final gate before sharing the repo link.

### Application (Part B — Core)

| # | Item | Location / Evidence |
|---|------|-------------------|
| 1 | Working frontend | `frontend/` |
| 2 | Working backend API | `backend/` |
| 3 | Database with persistence | DB + migrations |
| 4 | Schema / model scripts | `backend/src/models/` |
| 5 | Seed / sample data | `backend/seed/` or seed script |
| 6 | Input validation (backend) | Controllers / validators |
| 7 | Error handling (backend + UI) | Middleware + UI error states |
| 8 | Keyword search | API + UI |
| 9 | Filter by status | API + UI |
| 10 | State machine (valid/invalid transitions) | Service layer + tests |
| 11 | Integration tests for state machine | `backend/tests/` |
| 12 | README with local setup | `README.md` |
| 13 | `.env.example` (no real secrets) | Root or `backend/.env.example` |

### AI Workflow & Lifecycle Artifacts

| # | Item | Location |
|---|------|----------|
| 14 | Tool workflow document | `tool-workflow.md` (root) |
| 15 | Cursor project context | `tool-specific/cursor-workflow/project-context.md` |
| 16 | Spec | `tool-specific/cursor-workflow/spec.md` |
| 17 | Tasks | `tool-specific/cursor-workflow/tasks.md` |
| 18 | Acceptance criteria | `tool-specific/cursor-workflow/acceptance-criteria.md` |
| 19 | Cursor rules / instructions | `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` |
| 20 | Full prompt history | `prompts/` or `docs/prompt-history.md` |
| 21 | Requirement analysis | In spec or `docs/requirements-analysis.md` |
| 22 | Design notes | In spec or `docs/design.md` |
| 23 | Testing notes | `docs/testing-notes.md` |
| 24 | Debugging notes | `docs/debugging-notes.md` |
| 25 | Code review notes | `docs/code-review-notes.md` |
| 26 | Reflection | `docs/reflection.md` |
| 27 | PR description | `docs/PR_DESCRIPTION.md` or actual GitHub PR |

### Submission Form (Part C)

| # | Item |
|---|------|
| 28 | Git repository link (accessible to competency team) |
| 29 | Selected project option: **Support Ticket Management System** |
| 30 | Primary AI tool: **Cursor** |
| 31 | Written answers (requirements, AI usage, decisions, testing, improvements) |
| 32 | Pointers to specific commits (e.g. where you fixed an AI mistake) |

---

## 2. Recommended Tech Stack

| Layer | Suggestion | Why |
|-------|------------|-----|
| Frontend | React + Vite + TypeScript | Fast dev, common in competency |
| Styling | CSS Modules or Tailwind | Keep UI clean quickly |
| Backend | Node.js + Express + TypeScript | Matches React ecosystem |
| Database | MongoDB | Exercise accepts MongoDB |
| ODM | Mongoose | Schemas, models, and seeding |
| Testing | Jest + Supertest | Integration tests for API |
| HTTP client | fetch or axios | Frontend → backend |

You may swap (e.g. Java/Spring, Python/FastAPI) — keep the same step order.

---

## 3. Repository Structure

Create this layout early (adjust names if needed):

```
C1_PROJECT/
├── README.md
├── tool-workflow.md
├── .env.example
├── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/        # API calls
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── middleware/
│   │   └── index.ts
│   │   ├── models/            # Mongoose models
│   │   ├── config/            # database.ts
│   ├── tests/
│   ├── seed/
│   └── package.json
├── tool-specific/
│   └── cursor-workflow/
│       ├── project-context.md
│       ├── spec.md
│       ├── tasks.md
│       ├── acceptance-criteria.md
│       └── cursor-rules-or-instructions.md
├── docs/
│   ├── requirements-analysis.md
│   ├── design.md
│   ├── testing-notes.md
│   ├── debugging-notes.md
│   ├── code-review-notes.md
│   ├── reflection.md
│   └── PR_DESCRIPTION.md
└── prompts/
    └── prompt-history.md      # chronological AI prompts + outcomes
```

---

## Phase 0 — Planning & AI Workflow Artifacts

> **Do this before coding.** Part A is ~20% of effort — don't skip it.

### Step 0.1 — Create Git repository
- [ ] Initialize git repo
- [ ] Add `.gitignore` (node_modules, .env, dist, etc.)
- [ ] Create initial commit: `chore: initialize repository`

### Step 0.2 — Write requirement analysis
- [ ] Create `docs/requirements-analysis.md`
- [ ] Break down User, Ticket, Comment entities
- [ ] List all Core features and the 5 allowed status transitions
- [ ] Note what is **out of scope** (user CRUD UI, auth for Core)
- [ ] Use AI to draft, then **edit in your own words**

### Step 0.3 — Create `tool-specific/cursor-workflow/project-context.md`
- [ ] Project name, stack choice, folder structure
- [ ] Entity definitions and status state machine rules
- [ ] API conventions (REST, error format, validation approach)
- [ ] Coding standards (naming, file layout)
- [ ] What NOT to share with AI (secrets, real emails)

### Step 0.4 — Create `tool-specific/cursor-workflow/spec.md`
- [ ] Functional requirements per feature
- [ ] API endpoint list (method, path, request/response)
- [ ] UI pages and navigation flow
- [ ] Validation rules per field
- [ ] Review and improve AI-generated spec — don't copy blindly

### Step 0.5 — Create `tool-specific/cursor-workflow/tasks.md`
- [ ] Copy this plan's phases into task list format
- [ ] Mark tasks pending / in-progress / done as you go

### Step 0.6 — Create `tool-specific/cursor-workflow/acceptance-criteria.md`
- [ ] Copy Core acceptance criteria from exercise brief
- [ ] Add testable "given/when/then" for state machine

### Step 0.7 — Create `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`
- [ ] Rules for AI: stack, patterns, no secrets, validate all inputs
- [ ] How to structure commits and update spec when design changes

### Step 0.8 — Create `tool-workflow.md` (Part A submission)
- [ ] Primary AI tool: Cursor
- [ ] How you provide project context
- [ ] AI for: requirements, planning, code gen, validation, testing, debugging, review
- [ ] What you avoid sharing with AI
- [ ] How you'd reuse this workflow on a real project

### Step 0.9 — Start prompt history
- [ ] Create `prompts/prompt-history.md`
- [ ] Log every meaningful prompt: date, goal, prompt summary, outcome, what you changed

---

## Phase 1 — Project Scaffolding

### Step 1.1 — Create monorepo / root README skeleton
- [ ] Create root `README.md` with project title and placeholder sections
- [ ] Commit: `docs: add README skeleton`

### Step 1.2 — Scaffold backend project
- [ ] `mkdir backend && cd backend`
- [ ] `npm init -y`
- [ ] Install: express, cors, dotenv, typescript, ts-node, dev deps
- [ ] Add `tsconfig.json`, `src/index.ts`
- [ ] Add npm scripts: `dev`, `build`, `start`, `test`
- [ ] Commit: `chore: scaffold backend`

### Step 1.3 — Scaffold frontend project
- [ ] `npm create vite@latest frontend -- --template react-ts`
- [ ] Install dependencies
- [ ] Verify `npm run dev` works
- [ ] Commit: `chore: scaffold frontend`

### Step 1.4 — Configure environment variables
- [ ] Create `backend/.env.example` (PORT, DATABASE_URL)
- [ ] Create root `.env.example` if needed
- [ ] Document in README — never commit real `.env`
- [ ] Commit: `chore: add environment variable examples`

### Step 1.5 — Wire CORS and health check
- [ ] Backend: `GET /api/health` returns `{ status: "ok" }`
- [ ] Enable CORS for frontend origin
- [ ] Frontend: test call to health endpoint on load (optional debug)
- [ ] Commit: `feat: add health check and CORS`

---

## Phase 2 — Database Setup

### Step 2.1 — Choose and install database tooling
- [ ] Pick **MongoDB**
- [ ] Install Mongoose: `npm install mongoose`
- [ ] Create `src/config/database.ts` for MongoDB connection
- [ ] Add `MONGODB_URI` to `.env.example`
- [ ] Commit: `chore: add Mongoose and MongoDB config`

### Step 2.2 — Define User model (Mongoose)
- [ ] Model: `name`, `email`, `role`
- [ ] `role` enum: `admin`, `agent`, `user`
- [ ] Commit: `feat(db): add User model`

### Step 2.3 — Define Ticket model (Mongoose)
- [ ] Fields: `title`, `description`, `priority`, `status`
- [ ] References: `assignedTo` → User, `createdBy` → User
- [ ] Timestamps: `createdAt`, `updatedAt`
- [ ] `priority` enum: `low`, `medium`, `high`
- [ ] `status` enum: `open`, `in_progress`, `resolved`, `closed`, `cancelled`
- [ ] Commit: `feat(db): add Ticket model`

### Step 2.4 — Define Comment model (Mongoose)
- [ ] Fields: `ticketId`, `message`, `createdBy`, `createdAt`
- [ ] References: Comment → Ticket, Comment → User
- [ ] Commit: `feat(db): add Comment model`

### Step 2.5 — Verify database connection and indexes
- [ ] Start MongoDB locally (or use MongoDB Atlas)
- [ ] Verify models register and connection succeeds
- [ ] Add indexes if needed (e.g. unique email on User)
- [ ] Commit: `feat(db): verify MongoDB connection and indexes`

### Step 2.6 — Create seed script
- [ ] Seed at least 3–5 users (different roles)
- [ ] Seed 8–10 tickets (various statuses and priorities)
- [ ] Seed several comments across tickets
- [ ] Add npm script: `npm run seed`
- [ ] Document seed command in README
- [ ] Commit: `feat(db): add seed data`

### Step 2.7 — Verify persistence after restart
- [ ] Stop app, restart MongoDB and server, confirm data still there
- [ ] Note result in `docs/testing-notes.md`
- [ ] Commit: `test: verify data persistence after restart`

---

## Phase 3 — Backend Foundation

### Step 3.1 — Shared types and enums
- [ ] Export `TicketStatus`, `Priority`, `Role` enums/constants
- [ ] Shared TypeScript interfaces for API responses
- [ ] Commit: `feat: add shared types and enums`

### Step 3.2 — Error handling middleware
- [ ] Central error handler middleware
- [ ] Consistent JSON error shape: `{ error: string, details?: ... }`
- [ ] Handle 400, 404, 409, 500
- [ ] Commit: `feat: add error handling middleware`

### Step 3.3 — Validation helper setup
- [ ] Choose: Zod, Joi, or express-validator
- [ ] Create reusable validation middleware pattern
- [ ] Commit: `feat: add validation layer`

### Step 3.4 — API router structure
- [ ] Create `routes/tickets.ts`, `routes/comments.ts`, `routes/users.ts`
- [ ] Mount under `/api` in `index.ts`
- [ ] Commit: `feat: add API route structure`

---

## Phase 4 — Backend APIs (One Step Per Endpoint)

> **Rule:** Implement → test with curl/Postman → commit → log prompt.  
> Each step = one endpoint (or one tightly related pair).

### Step 4.1 — API: List all tickets
- [ ] `GET /api/tickets`
- [ ] Return tickets with `createdBy`, `assignedTo` (user names)
- [ ] Order by `updatedAt` desc
- [ ] Commit: `feat(api): GET /api/tickets list all tickets`

### Step 4.2 — API: Get single ticket by ID
- [ ] `GET /api/tickets/:id`
- [ ] Include comments (newest first)
- [ ] Return 404 if not found
- [ ] Commit: `feat(api): GET /api/tickets/:id ticket detail`

### Step 4.3 — API: Create ticket
- [ ] `POST /api/tickets`
- [ ] Body: `title`, `description`, `priority`, `assignedTo` (user id), `createdBy` (user id)
- [ ] Default `status` = `open`
- [ ] Validate required fields; reject empty title/description
- [ ] Commit: `feat(api): POST /api/tickets create ticket`

### Step 4.4 — API: Update ticket fields
- [ ] `PATCH /api/tickets/:id`
- [ ] Allow update: `title`, `description`, `priority`, `assignedTo`
- [ ] **Do not** allow raw `status` change here (state machine step later)
- [ ] Validate inputs; 404 if ticket missing
- [ ] Commit: `feat(api): PATCH /api/tickets/:id update ticket fields`

### Step 4.5 — API: Change ticket status (state machine entry point)
- [ ] `PATCH /api/tickets/:id/status`
- [ ] Body: `{ status: "in_progress" }` (target status only)
- [ ] Delegate to state machine service (Phase 5)
- [ ] Return 400/409 with clear message on invalid transition
- [ ] Commit: `feat(api): PATCH /api/tickets/:id/status change status`

### Step 4.6 — API: Add comment to ticket
- [ ] `POST /api/tickets/:id/comments`
- [ ] Body: `message`, `createdBy` (user id)
- [ ] Validate non-empty message
- [ ] Return 404 if ticket not found
- [ ] Commit: `feat(api): POST /api/tickets/:id/comments add comment`

### Step 4.7 — API: Keyword search tickets
- [ ] `GET /api/tickets/search?q=keyword`
- [ ] Search in `title` and `description` (case-insensitive)
- [ ] Commit: `feat(api): GET /api/tickets/search keyword search`

### Step 4.8 — API: Filter tickets by status
- [ ] `GET /api/tickets?status=open` (or separate `/api/tickets/filter`)
- [ ] Validate status value against allowed enum
- [ ] Commit: `feat(api): filter tickets by status`

### Step 4.9 — API: Combined search + status filter
- [ ] `GET /api/tickets?status=open&q=login`
- [ ] Both filters work together
- [ ] Commit: `feat(api): combine search and status filter`

### Step 4.10 — API: List users (for assignee dropdown)
- [ ] `GET /api/users`
- [ ] Return seeded users (id, name, email, role) — no user CRUD for Core
- [ ] Commit: `feat(api): GET /api/users list seeded users`

---

## Phase 5 — Status State Machine

> **This is the signature Core piece.** Backend must enforce; frontend must handle errors.

### Step 5.1 — Define transition map in code
- [ ] Create `services/statusMachine.ts`
- [ ] Map allowed transitions:
  - `open` → `in_progress`
  - `in_progress` → `resolved`
  - `resolved` → `closed`
  - `open` → `cancelled`
  - `in_progress` → `cancelled`
- [ ] Function: `canTransition(from, to): boolean`
- [ ] Function: `getAllowedTransitions(from): string[]`
- [ ] Commit: `feat: implement status transition map`

### Step 5.2 — Integrate state machine into status update API
- [ ] On invalid transition: return **400** with message e.g. `"Cannot transition from resolved to open"`
- [ ] On valid transition: update DB and return updated ticket
- [ ] Commit: `feat: enforce state machine on status updates`

### Step 5.3 — Expose allowed next statuses (optional helper API)
- [ ] `GET /api/tickets/:id/allowed-transitions`
- [ ] Returns list of valid next statuses for current ticket
- [ ] Helps frontend show only valid buttons
- [ ] Commit: `feat(api): GET allowed transitions for ticket`

### Step 5.4 — Manual API testing of state machine
- [ ] Test all 5 valid transitions succeed
- [ ] Test invalid ones: `open→closed`, `resolved→in_progress`, `closed→anything`, etc.
- [ ] Record results in `docs/testing-notes.md`
- [ ] Commit: `test: document manual state machine API tests`

---

## Phase 6 — Frontend (One Step Per Page/Feature)

> **Rule:** Each page/feature is its own step. Matching API should already exist from Phase 4.

### Step 6.1 — Frontend foundation
- [ ] Set up React Router (`/`, `/tickets/new`, `/tickets/:id`)
- [ ] Create API client module (`services/api.ts`) with base URL from env
- [ ] Create shared TypeScript types matching backend
- [ ] Commit: `feat(frontend): routing, API client, and types`

### Step 6.2 — Layout and navigation
- [ ] App shell: header, nav links (Ticket List, Create Ticket)
- [ ] Basic responsive layout and consistent styling
- [ ] Commit: `feat(frontend): app layout and navigation`

### Step 6.3 — Page: Ticket List
- [ ] Create `pages/TicketListPage.tsx`
- [ ] Call `GET /api/tickets` (Step 4.1)
- [ ] Show table/cards: title, status, priority, assignee, updated date
- [ ] Link each row to detail page
- [ ] Loading and error states
- [ ] Commit: `feat(frontend): ticket list page`

### Step 6.4 — Feature: Status filter on Ticket List
- [ ] Dropdown or tabs: All, Open, In Progress, Resolved, Closed, Cancelled
- [ ] Call API with `?status=` (Step 4.8)
- [ ] Commit: `feat(frontend): status filter on ticket list`

### Step 6.5 — Feature: Keyword search on Ticket List
- [ ] Search input with debounce
- [ ] Call search API (Step 4.7 / 4.9)
- [ ] Commit: `feat(frontend): keyword search on ticket list`

### Step 6.6 — Page: Create Ticket
- [ ] Create `pages/CreateTicketPage.tsx`
- [ ] Form: title, description, priority, assignee (dropdown from users API)
- [ ] Hardcode or select `createdBy` from seeded users for Core
- [ ] Call `POST /api/tickets` (Step 4.3)
- [ ] Show validation errors from backend
- [ ] Redirect to detail page on success
- [ ] Commit: `feat(frontend): create ticket page`

### Step 6.7 — Page: Ticket Detail (read-only view)
- [ ] Create `pages/TicketDetailPage.tsx`
- [ ] Call `GET /api/tickets/:id` (Step 4.2)
- [ ] Display all ticket fields and metadata
- [ ] 404-friendly "Ticket not found" state
- [ ] Commit: `feat(frontend): ticket detail view`

### Step 6.8 — Feature: Edit ticket fields on Detail page
- [ ] Inline edit or edit mode for title, description, priority, assignee
- [ ] Call `PATCH /api/tickets/:id` (Step 4.4)
- [ ] Show success/error feedback
- [ ] Commit: `feat(frontend): edit ticket fields`

### Step 6.9 — Feature: Status change on Detail page
- [ ] Show only **allowed** next statuses (from API or client-side map)
- [ ] Call `PATCH /api/tickets/:id/status` (Step 4.5)
- [ ] On invalid transition error: show clear message from backend
- [ ] Refresh ticket after successful change
- [ ] Commit: `feat(frontend): status change with state machine UI`

### Step 6.10 — Feature: Comments section on Detail page
- [ ] List existing comments with author and timestamp
- [ ] Add comment form
- [ ] Call `POST /api/tickets/:id/comments` (Step 4.6)
- [ ] Clear form and refresh comments on success
- [ ] Commit: `feat(frontend): comments on ticket detail`

### Step 6.11 — UI error handling polish
- [ ] Global or per-page error banners
- [ ] Network failure messages
- [ ] Empty states (no tickets, no comments, no search results)
- [ ] Commit: `feat(frontend): error and empty states`

---

## Phase 7 — Integration & Polish

### Step 7.1 — End-to-end smoke test
- [ ] Create ticket → appears in list → open detail → edit → change status → add comment
- [ ] Restart server and DB → data still present
- [ ] Document flow in `docs/testing-notes.md`
- [ ] Commit: `test: end-to-end smoke test documented`

### Step 7.2 — README setup instructions (complete)
- [ ] Prerequisites (Node version, DB)
- [ ] Clone, install, env setup, migrate, seed
- [ ] How to run backend and frontend
- [ ] How to run tests
- [ ] Commit: `docs: complete README setup instructions`

### Step 7.3 — Code review pass
- [ ] Review your own code (or use AI for review, then **you** decide fixes)
- [ ] Document findings in `docs/code-review-notes.md`
- [ ] Fix issues found
- [ ] Commit: `refactor: address code review findings`

### Step 7.4 — Security check
- [ ] No secrets in repo
- [ ] `.env` in `.gitignore`
- [ ] No sensitive data in prompt history
- [ ] Commit if fixes needed: `chore: remove secrets and update gitignore`

---

## Phase 8 — Testing

### Step 8.1 — Test infrastructure setup
- [ ] Install Jest + Supertest in backend
- [ ] Test DB strategy: MongoDB Memory Server or separate test database
- [ ] Add `npm test` script
- [ ] Commit: `chore: setup test infrastructure`

### Step 8.2 — Integration test: valid status transitions
- [ ] Test: `open` → `in_progress` ✓
- [ ] Test: `in_progress` → `resolved` ✓
- [ ] Test: `resolved` → `closed` ✓
- [ ] Test: `open` → `cancelled` ✓
- [ ] Test: `in_progress` → `cancelled` ✓
- [ ] Commit: `test: valid status transition integration tests`

### Step 8.3 — Integration test: invalid status transitions
- [ ] Test: `open` → `closed` ✗
- [ ] Test: `open` → `resolved` ✗
- [ ] Test: `resolved` → `in_progress` ✗
- [ ] Test: `closed` → `open` ✗
- [ ] Test: `cancelled` → `open` ✗
- [ ] Assert correct HTTP status (400/409) and error message
- [ ] Commit: `test: invalid status transition integration tests`

### Step 8.4 — Integration test: create ticket validation
- [ ] Test: missing title → 400
- [ ] Test: missing description → 400
- [ ] Test: valid payload → 201
- [ ] Commit: `test: create ticket validation tests`

### Step 8.5 — Integration test: search and filter
- [ ] Test: keyword search returns matching tickets
- [ ] Test: status filter returns only matching status
- [ ] Commit: `test: search and filter integration tests`

### Step 8.6 — Run full test suite and document
- [ ] All tests pass locally
- [ ] Note command and result in README and `docs/testing-notes.md`
- [ ] Commit: `docs: document test results`

---

## Phase 9 — Documentation & Lifecycle Artifacts

### Step 9.1 — Finalize `tool-workflow.md`
- [ ] Complete all 11 sections required by Part A
- [ ] Commit: `docs: complete tool-workflow.md`

### Step 9.2 — Update cursor-workflow docs to match final implementation
- [ ] `spec.md` reflects what was actually built
- [ ] `tasks.md` all Core items marked done
- [ ] `acceptance-criteria.md` checked off
- [ ] Commit: `docs: sync cursor-workflow docs with implementation`

### Step 9.3 — Complete prompt history
- [ ] Every major feature has at least one logged prompt
- [ ] Include prompts where AI was **wrong** and how you fixed it
- [ ] Commit: `docs: complete prompt history`

### Step 9.4 — Write debugging notes
- [ ] `docs/debugging-notes.md`: bugs hit, how you found them, fixes
- [ ] Link to specific commits
- [ ] Commit: `docs: add debugging notes`

### Step 9.5 — Write reflection
- [ ] `docs/reflection.md`: what went well, what was hard, what you'd improve
- [ ] Honest assessment of AI strengths and limitations
- [ ] Commit: `docs: add reflection`

### Step 9.6 — Write PR description
- [ ] `docs/PR_DESCRIPTION.md` or open a real PR on GitHub
- [ ] Summary, test plan, screenshots optional
- [ ] Commit: `docs: add PR description`

### Step 9.7 — Design notes
- [ ] `docs/design.md`: architecture diagram (ASCII or mermaid), key decisions
- [ ] Why state machine lives in service layer, why seeded users, etc.
- [ ] Commit: `docs: add design notes`

---

## Phase 10 — Submission (Part C)

### Step 10.1 — Pre-submission verification
- [ ] Fresh clone test: follow README on a clean folder
- [ ] All Core acceptance criteria pass (see tracker below)
- [ ] All submission checklist items present (Section 1)

### Step 10.2 — Push repository
- [ ] Push to GitHub/GitLab (accessible to competency team)
- [ ] Ensure main branch has complete work
- [ ] Optional: tag release `v1.0.0-core`

### Step 10.3 — Fill submission form
Prepare answers for:
- [ ] **Requirement understanding** — entities, state machine, what's Core vs Stretch
- [ ] **AI usage across lifecycle** — point to `tool-workflow.md` and `prompts/`
- [ ] **Key design decisions** — state machine in backend, stack choice
- [ ] **Testing approach** — integration tests, manual E2E
- [ ] **Debugging example** — link commit where you fixed an AI mistake
- [ ] **What you'd improve** — from reflection doc

### Step 10.4 — Submit and keep repo available
- [ ] Submit form with repo link
- [ ] Don't force-push or delete history before feedback

---

## Phase 11 — Stretch (Optional)

Only after Core is complete and artifacts are done.

| Step | Feature | Notes |
|------|---------|-------|
| 11.1 | Filter by priority + assignee | Extend list API and UI |
| 11.2 | Sorting + pagination | Backend query params + UI controls |
| 11.3 | User CRUD + role management | New pages + APIs |
| 11.4 | Authentication (JWT/session) | Login, protected routes, API auth |
| 11.5 | Unit tests for state machine | Pure function tests |
| 11.6 | Edge-case / failure tests | Network, concurrency, malformed input |
| 11.7 | Swagger / OpenAPI | `/api/docs` |
| 11.8 | Docker Compose | App + DB one command |
| 11.9 | CI workflow | GitHub Actions: lint + test |
| 11.10 | Reusable prompt templates | Add to `tool-specific/cursor-workflow/` |

---

## Suggested Daily Schedule

| Day | Focus |
|-----|-------|
| **Day 1** | Phase 0 (all planning artifacts) + Phase 1 (scaffold) |
| **Day 2** | Phase 2 (database) + Phase 3 (backend foundation) |
| **Day 3** | Phase 4 (APIs 4.1–4.6) |
| **Day 4** | Phase 5 (state machine) + Phase 4.7–4.10 |
| **Day 5** | Phase 6 (frontend pages 6.1–6.7) |
| **Day 6** | Phase 6 (frontend 6.8–6.11) + Phase 7 (polish) |
| **Day 7** | Phase 8 (tests) + Phase 9 (docs) + Phase 10 (submit) |

---

## Core Acceptance Criteria Tracker

| Criteria | Step(s) | Done |
|----------|---------|------|
| Create ticket via UI | 4.3, 6.6 | [ ] |
| View all tickets from DB | 4.1, 6.3 | [ ] |
| Ticket detail view | 4.2, 6.7 | [ ] |
| Update fields + reassign | 4.4, 6.8 | [ ] |
| Add comments | 4.6, 6.10 | [ ] |
| Status only via valid transitions | 5.1–5.2, 6.9 | [ ] |
| Keyword search works | 4.7, 6.5 | [ ] |
| Filter by status works | 4.8, 6.4 | [ ] |
| Data survives restart | 2.7, 7.1 | [ ] |
| Backend validation | 4.3, 4.4, 4.6 | [ ] |
| No secrets in repo | 7.4 | [ ] |
| State machine integration tests pass | 8.2, 8.3 | [ ] |

---

## Commit Message Convention (Suggested)

```
feat(api): ...
feat(frontend): ...
feat(db): ...
test: ...
docs: ...
fix: ...
refactor: ...
chore: ...
```

Keep commits **small and traceable** — reviewers (and the form) may ask for the commit where you fixed an AI mistake.

---

## Quick Reference: API Endpoints

| Method | Path | Step |
|--------|------|------|
| GET | `/api/health` | 1.5 |
| GET | `/api/tickets` | 4.1 |
| GET | `/api/tickets/:id` | 4.2 |
| POST | `/api/tickets` | 4.3 |
| PATCH | `/api/tickets/:id` | 4.4 |
| PATCH | `/api/tickets/:id/status` | 4.5 |
| POST | `/api/tickets/:id/comments` | 4.6 |
| GET | `/api/tickets/search?q=` | 4.7 |
| GET | `/api/tickets?status=&q=` | 4.8–4.9 |
| GET | `/api/users` | 4.10 |
| GET | `/api/tickets/:id/allowed-transitions` | 5.3 (optional) |

---

## Quick Reference: Frontend Pages

| Page / Feature | Step |
|----------------|------|
| Routing + API client | 6.1 |
| Layout + nav | 6.2 |
| Ticket List | 6.3 |
| Status filter | 6.4 |
| Keyword search | 6.5 |
| Create Ticket | 6.6 |
| Ticket Detail | 6.7 |
| Edit ticket fields | 6.8 |
| Status change | 6.9 |
| Comments | 6.10 |
| Error / empty states | 6.11 |

---

*Last updated: plan created for C1_PROJECT — Support Ticket Management System Core.*
