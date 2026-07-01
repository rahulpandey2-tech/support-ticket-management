# Tool Workflow — Cursor (Part A Submission)

> How I use Cursor across the software development lifecycle for the Support Ticket Management System exercise.

---

## 1. Primary AI Tool

**Cursor** (Agent mode) is my primary AI tool for this exercise.

I use it for requirement analysis, planning, implementation, testing, debugging, code review, and documentation — not only for generating code.

---

## 2. How I Provide Project Context

I maintain **persistent context documents** in the repository so each Cursor session starts with shared understanding:

| File | Role |
|------|------|
| `tool-specific/cursor-workflow/project-context.md` | Stack, folder structure, domain rules, API conventions |
| `tool-specific/cursor-workflow/spec.md` | API endpoints, UI pages, validation rules |
| `tool-specific/cursor-workflow/acceptance-criteria.md` | Testable done criteria |
| `docs/requirements-analysis.md` | Business requirements and entities |
| `IMPLEMENTATION_PLAN.md` | Step-by-step build order |
| `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` | Rules AI must follow |

**Workflow:**
- I work **one step at a time** from `IMPLEMENTATION_PLAN.md` (e.g. "Step 4.3 — create ticket API")
- Each prompt references the step number and relevant spec sections
- I keep `tasks.md` updated so progress is visible
- All prompts are logged in `prompts/prompt-history.md`

This avoids re-explaining the project from scratch every session and keeps AI output aligned with the spec.

---

## 3. AI for Requirement Analysis

- I shared the full exercise participant guide with Cursor and asked for a granular implementation plan
- Cursor drafted `docs/requirements-analysis.md`; I reviewed it for accuracy against the exercise brief
- I broke down entities (User, Ticket, Comment), Core features, and the 5 status transitions
- I explicitly documented what is out of scope (auth, user CRUD UI, pagination) for Core

**Principle:** AI drafts structure quickly; I verify business rules (especially the state machine) myself.

---

## 4. AI for Planning and Design

- `IMPLEMENTATION_PLAN.md` — full phased plan with small steps (separate API and UI steps)
- `tool-specific/cursor-workflow/spec.md` — API contracts, request/response shapes, Prisma schema
- `tool-specific/cursor-workflow/project-context.md` — architecture and coding standards
- `tool-specific/cursor-workflow/tasks.md` — live progress tracker

I treat these as **living documents** — they will be updated if implementation reveals a better approach.

---

## 5. AI for Code Generation

- One feature per prompt (one endpoint or one page — not whole phases at once)
- I specify: step number, stack, files to create, constraints from spec
- I read all generated code before accepting — no blind copy-paste
- Commits are small and named by step (`feat(api): POST /api/tickets`)

**Example approach:** "Step 4.1 — implement GET /api/tickets per spec.md; include assignedTo and createdBy user names; order by updatedAt desc."

---

## 6. How I Validate AI-Generated Code

| Method | When |
|--------|------|
| Run locally | After every backend/frontend change |
| Manual API test | curl or Postman before wiring UI |
| TypeScript compile | Catch type errors early |
| Integration tests | State machine and validation (mandatory) |
| Check against spec | Does behaviour match `spec.md` and acceptance criteria? |

If AI output is wrong, I fix it myself and log what changed in `prompts/prompt-history.md`.

---

## 7. AI for Testing

- Ask Cursor to draft Jest + Supertest tests from `acceptance-criteria.md`
- Focus on mandatory tier: valid + invalid status transitions
- Verify tests fail before fix and pass after (where practical)
- Document manual E2E smoke tests in `docs/testing-notes.md`

---

## 8. AI for Debugging

When a bug appears:
1. Reproduce the issue locally
2. Paste error message + relevant code snippet + expected behaviour into Cursor
3. Apply fix only after understanding the root cause
4. Log issue and fix in `docs/debugging-notes.md` with commit reference

Common AI mistakes I watch for: status logic only in frontend, missing backend validation, allowing status via generic PATCH.

---

## 9. AI for Code Review

- After a phase, ask Cursor to review code against `spec.md` and `acceptance-criteria.md`
- I decide which suggestions to accept — AI is advisory, not authoritative
- Findings documented in `docs/code-review-notes.md`

---

## 10. What I Avoid Sharing with AI

| Do not share | Use instead |
|--------------|-------------|
| Real `.env` values | Placeholders from `.env.example` |
| Production database URLs | `file:./dev.db` or example strings |
| Real colleague emails | `user@example.com` in seeds and prompts |
| API keys, JWT secrets, passwords | `your-secret-here` placeholders |
| Company-internal confidential data | Generic descriptions |

---

## 11. Reusing This Workflow on a Real Project

1. **Context first** — Create `project-context.md`, `spec.md`, and acceptance criteria before heavy coding
2. **Small steps** — Break work into implementable, testable units with traceable commits
3. **Spec-driven** — AI implements against written spec, not vague prompts
4. **Validate always** — Run, test, and review AI output; never ship unchecked code
5. **Log prompts** — Keep prompt history for team learning and auditability
6. **Backend owns rules** — Business logic (state machines, auth rules) enforced server-side
7. **Update docs** — When design changes, update spec and tasks in the same PR

---

*Document: Step 0.8 — Tool Workflow (Part A). Primary tool: Cursor.*
