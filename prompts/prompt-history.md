# Prompt History

> Chronological log of meaningful AI prompts for the Support Ticket Management System.  
> **Update after each Cursor session.** Include what you changed if AI was wrong.

---

## How to log an entry

```markdown
## YYYY-MM-DD — Step X.Y — [Short title]

**Goal:** What you were trying to accomplish

**Prompt summary:** What you asked Cursor (1–3 sentences)

**Outcome:** What was created or changed (files, commits)

**Changes made:** Edits you made to AI output, or "None — accepted as-is"
```

---

## 2026-07-01 — Exercise setup — Implementation plan

**Goal:** Understand the JS AI Capability Exercise and get a full step-by-step plan.

**Prompt summary:** Shared the full participant guide; asked to read it carefully and create a granular implementation plan in MD covering every step, submission items, and separate API/UI steps.

**Outcome:** Created `IMPLEMENTATION_PLAN.md` with phases 0–11, submission checklist, API/UI mapping, and daily schedule.

**Changes made:** Asked for plan only first; later removed all generated files to build step-by-step and manage chat history manually.

---

## 2026-07-01 — Step 0.1 — Create Git repository

**Goal:** Initialize version control for the project.

**Prompt summary:** "Start with phase 0, do step 0.1 — create git repository."

**Outcome:** Created `.gitignore`; git init and initial commit done locally. Remote added: `github.com/rahulpandey2-tech/support-ticket-management`.

**Changes made:** Git was not on PATH initially; installed Git and completed init/commit manually.

---

## 2026-07-01 — Step 0.2 — Requirements analysis

**Goal:** Document business requirements before coding.

**Prompt summary:** "Do step 0.2 — write requirements-analysis."

**Outcome:** Created `docs/requirements-analysis.md` with entities, Core features, state machine, out-of-scope items, and acceptance criteria summary.

**Changes made:** Reviewed entity definitions and 5 transitions against exercise brief; kept Core scope without auth.

---

## 2026-07-01 — Step 0.3 — Project context

**Goal:** Create persistent Cursor context document.

**Prompt summary:** "Step 0.3 — create tool-specific/cursor-workflow/project-context.md."

**Outcome:** Created `project-context.md` with stack (React, Express, Prisma, SQLite), folder structure, domain model, API conventions, coding standards.

**Changes made:** Chose SQLite for simpler local setup for reviewers.

---

## 2026-07-01 — Steps 0.4–0.6 — Spec, tasks, acceptance criteria

**Goal:** Complete planning artifacts for spec-driven development.

**Prompt summary:** "Step 0.4 spec.md, Step 0.5 tasks.md, Step 0.6 acceptance-criteria.md."

**Outcome:**
- `spec.md` — full API spec, UI navigation, validation rules, Prisma schema
- `tasks.md` — all phases with 0.1–0.6 marked done
- `acceptance-criteria.md` — Given/When/Then for all Core criteria + state machine tests

**Changes made:** Unified search/filter on `GET /api/tickets?status=&q=` in spec for cleaner API design.

---

## 2026-07-01 — Steps 0.7–0.9 — Rules, tool workflow, prompt history

**Goal:** Complete Phase 0 planning artifacts.

**Prompt summary:** "Step 0.7 cursor-rules-or-instructions.md, Step 0.8 tool-workflow.md, Step 0.9 prompt history."

**Outcome:**
- `cursor-rules-or-instructions.md` — AI rules, commit convention, session workflow
- `tool-workflow.md` — Part A submission document
- `prompt-history.md` — this file, with session log to date

**Changes made:** Logged prior sessions retroactively from chat history.

---

<!-- Add new entries below as you complete each step -->

## _Template — Step X.Y — [Title]_

**Goal:**

**Prompt summary:**

**Outcome:**

**Changes made:**

---

*Document: Step 0.9 — Prompt history started. Keep logging every meaningful prompt.*
