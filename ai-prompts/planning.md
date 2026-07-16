# AI Prompts — Planning & Design

> Representative prompts from early project phases. Full log: [`../prompts/prompt-history.md`](../prompts/prompt-history.md)

---

## Implementation plan

> I have the JS AI Capability Exercise participant guide. Read it carefully and create a detailed IMPLEMENTATION_PLAN.md — break Part B into small steps, separate API endpoints from UI pages, include commit messages and phases 0–10. Don't generate code yet, just the plan.

**Accepted:** Phased plan with one step per commit.  
**Changed:** Removed auto-generated code on first run — wanted to build step by step myself.

---

## Requirements

> Step 0.2 — write requirements-analysis.md for the Support Ticket Management System. Include entities, the 5 status transitions, what's in Core vs Stretch, and acceptance criteria summary. No auth in Core.

**Accepted:** Entity definitions and state machine table.  
**Rejected:** AI suggested optional "reopen ticket" transition — not in exercise brief.

---

## Stack decision

> I'm thinking SQLite + Prisma for easier local setup for reviewers. Update project-context.md with that stack unless you see a reason not to.

**Later changed:** Switched to MongoDB + Mongoose after deciding to use Atlas — see `ai-prompts/implementation.md`.

---

## Spec

> Step 0.4 — create spec.md with all API endpoints, request/response JSON shapes, validation rules, and UI routes. Put search and status filter on the same GET /api/tickets endpoint with query params.

**Accepted:** Unified `?status=&q=` design.  
**Changed:** Updated Prisma schema section to Mongoose models when stack changed.
