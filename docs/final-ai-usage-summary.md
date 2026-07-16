# Final AI Usage Summary

**Tool:** Cursor (Agent mode)  
**Project:** Support Ticket Management System  
**Period:** 2026-07-01 — 2026-07-16

---

## How AI was used

| Lifecycle area | Usage |
|----------------|-------|
| Requirements | Drafted docs; human verified state machine rules |
| Planning | IMPLEMENTATION_PLAN, spec, tasks, acceptance criteria |
| Implementation | Step-by-step backend APIs, frontend pages, tests |
| Debugging | Atlas DNS, Express 5 query bug, Jest Memory Server |
| Testing | Integration test suites, smoke scripts |
| Code review | Security scan, architecture check |
| Documentation | README, reflection, debugging notes, PR description |

---

## What was accepted vs changed

- **Accepted:** Layered backend structure, state machine design, React page layout, test cases from acceptance criteria
- **Changed:** Prisma → Mongoose mid-project; `req.validated` for Express 5; global Jest setup; type-only imports in frontend
- **Rejected:** Extra state transitions; status on generic PATCH; real credentials in example files

---

## Responsible AI practices

- Never pasted real `.env` values into prompts
- Used `@example.com` in seed data only
- Reviewed all generated code before commit
- Logged mistakes in prompt history and debugging notes

---

## Artifact locations

| Artifact | Path |
|----------|------|
| Full prompt log | `prompts/prompt-history.md` |
| Grouped prompts | `ai-prompts/` |
| Workflow (Part A) | `tool-workflow.md` |
| Reflection | `docs/reflection.md` |
| Debugging | `docs/debugging-notes.md` |

---

## Reuse on real projects

Persistent `project-context.md` + `spec.md`, one-step prompts, validate locally, backend owns business rules, log what AI got wrong.
