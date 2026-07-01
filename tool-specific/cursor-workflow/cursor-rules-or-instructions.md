# Cursor Rules & Instructions

> Rules and workflow for AI-assisted development on this project.  
> Attach or reference this file when starting a new Cursor session.

---

## 1. Project Rules for AI

### Stack (do not change without updating spec)

| Layer | Use |
|-------|-----|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite + Prisma |
| Validation | Zod (backend) |
| Testing | Jest + Supertest |

### Architecture patterns

- **Backend layering:** `Route → Controller → Service → Prisma`
- **State machine:** Must live in `backend/src/services/statusMachine.ts` — never only in React
- **Status updates:** Only via `PATCH /api/tickets/:id/status` — never through generic PATCH
- **API calls:** Frontend HTTP logic only in `frontend/src/services/api.ts`
- **One step per task:** Match `IMPLEMENTATION_PLAN.md` — one endpoint or one UI feature per prompt/commit

### Mandatory behaviours

1. Validate **all** write endpoints on the backend before database access
2. Return consistent error JSON: `{ "error": "message", "details"?: [...] }`
3. Reject invalid status transitions with HTTP 400 and a clear message
4. Keep commits small and traceable (`feat(api):`, `feat(frontend):`, `docs:`, `test:`)
5. Never commit `.env`, secrets, or real credentials
6. Follow existing naming and folder structure in `project-context.md`

### Do not

- Put business rules only in the frontend
- Allow `status` field in `PATCH /api/tickets/:id` body
- Skip integration tests for the state machine
- Add new dependencies without justification
- Expand scope into Stretch (auth, pagination, Swagger) before Core is done
- Copy-paste AI output without reading and understanding it

---

## 2. Session Workflow

### Before each implementation prompt

1. State the **step number** from `IMPLEMENTATION_PLAN.md` (e.g. "Step 4.3 — POST /api/tickets")
2. Reference:
   - `tool-specific/cursor-workflow/project-context.md`
   - `tool-specific/cursor-workflow/spec.md`
   - `docs/requirements-analysis.md`
3. Ask for **one step only** — not the whole phase at once
4. Log the prompt in `prompts/prompt-history.md` after the session

### After AI generates code

1. **Read** the full output — understand what changed and why
2. **Run** the app or tests locally before committing
3. **Fix** incorrect suggestions yourself; note fixes in prompt history
4. **Update** `tasks.md` — mark step done
5. **Update** `spec.md` if the design changed during implementation

### When AI makes mistakes (watch for these)

| Mistake | Correct approach |
|---------|------------------|
| Status logic only in React | Enforce in `statusMachine.ts` on backend |
| Single PATCH updates status + fields | Separate status endpoint |
| Missing Zod validation | Add validator before controller logic |
| Hardcoded ticket data in UI | Always fetch from API |
| Skipping error handling | Add middleware + UI error states |

---

## 3. Commit Convention

```
chore:     setup, config, dependencies
feat(api): backend endpoint or service
feat(db):  schema, migration, seed
feat(frontend): page or UI feature
test:      integration or unit tests
docs:      documentation, spec updates
fix:       bug fix
refactor:  code improvement, no behaviour change
```

**One logical step = one commit.** This makes it easy to point reviewers to specific changes (e.g. where you fixed an AI mistake).

---

## 4. When to Update Spec & Docs

| Event | Update |
|-------|--------|
| New API endpoint added | `spec.md` + `tasks.md` |
| Validation rule changed | `spec.md` + `acceptance-criteria.md` |
| Stack decision changed | `project-context.md` + `spec.md` |
| Bug found and fixed | `docs/debugging-notes.md` + prompt history |
| Phase completed | `tasks.md` status |
| Before submission | Sync all cursor-workflow docs with actual implementation |

---

## 5. Prompting Tips for Cursor

### Good prompt structure

```
Step X.Y from IMPLEMENTATION_PLAN.md — [short title]

Context: [stack, relevant files]
Task: [exactly what to build]
Constraints: [from spec — validation, state machine, etc.]
Do not: [scope limits]
```

### Example

```
Step 4.5 — PATCH /api/tickets/:id/status

Context: Express + Prisma + Zod. See spec.md and statusMachine.ts.
Task: Implement status change endpoint using statusMachine service.
Constraints: Return 400 on invalid transition. Do not allow status in PATCH /tickets/:id.
Do not: Implement frontend yet.
```

### Attach these files for best results

- `tool-specific/cursor-workflow/project-context.md`
- `tool-specific/cursor-workflow/spec.md`
- `IMPLEMENTATION_PLAN.md` (relevant step only)

---

## 6. Testing Rules

- State machine integration tests are **mandatory** before Core is complete
- Run `npm test` in backend after test-related changes
- Document manual E2E flows in `docs/testing-notes.md`
- Do not mark a step done in `tasks.md` until the feature works locally

---

## 7. Security Rules

- Secrets only in `.env` (gitignored)
- Use `.env.example` with placeholders
- Seed data: use `@example.com` emails, not real colleague addresses
- Do not paste real tokens or passwords into Cursor prompts

---

## 8. Related Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_PLAN.md` | Step-by-step build order |
| `project-context.md` | Persistent project context |
| `spec.md` | API and UI specification |
| `acceptance-criteria.md` | Testable done criteria |
| `tasks.md` | Progress tracker |
| `prompts/prompt-history.md` | AI prompt log |

---

*Document: Step 0.7 — Cursor Rules & Instructions.*
