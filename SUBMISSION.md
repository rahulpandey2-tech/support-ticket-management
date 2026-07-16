# Submission Index — Support Ticket Management System

> **Reviewer entry point.** This repo follows **both** structure guides in the exercise:
> - [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) Section 1 & 3 → lifecycle artifacts in **`docs/`**
> - [`REPOSITORY_STRUCTURE.md`](./REPOSITORY_STRUCTURE.md) → submission template at **repo root**

Duplicate filenames exist at root and under `docs/` so automated checks find artifacts regardless of which path is scanned.

---

## Candidate & AI Tool

| Item | Location |
|------|----------|
| Name, stack, dates | [`candidate-info.md`](./candidate-info.md) |
| **Primary AI tool: Cursor** | [`tool-workflow.md`](./tool-workflow.md) · [`docs/tool-workflow.md`](./docs/tool-workflow.md) |

---

## Part A — AI Workflow (required)

| Artifact | Root path | `docs/` path (IMPLEMENTATION_PLAN) |
|----------|-----------|--------------------------------------|
| Tool workflow | [`tool-workflow.md`](./tool-workflow.md) | [`docs/tool-workflow.md`](./docs/tool-workflow.md) |
| Prompt history | [`prompts/prompt-history.md`](./prompts/prompt-history.md) | [`docs/prompt-history.md`](./docs/prompt-history.md) |
| Project context | [`tool-specific/cursor-workflow/project-context.md`](./tool-specific/cursor-workflow/project-context.md) | — |
| Spec | [`tool-specific/cursor-workflow/spec.md`](./tool-specific/cursor-workflow/spec.md) | — |
| Tasks | [`tool-specific/cursor-workflow/tasks.md`](./tool-specific/cursor-workflow/tasks.md) | — |
| Acceptance criteria | [`acceptance-criteria.md`](./acceptance-criteria.md) | [`docs/acceptance-criteria.md`](./docs/acceptance-criteria.md) |
| Cursor rules | [`tool-specific/cursor-workflow/cursor-rules-or-instructions.md`](./tool-specific/cursor-workflow/cursor-rules-or-instructions.md) | — |
| Grouped prompts | [`ai-prompts/`](./ai-prompts/) | — |

---

## Planning & Requirements

| Artifact | Root path | `docs/` path |
|----------|-----------|--------------|
| Requirements analysis | [`requirements-analysis.md`](./requirements-analysis.md) | [`docs/requirements-analysis.md`](./docs/requirements-analysis.md) |
| Implementation plan | [`implementation-plan.md`](./implementation-plan.md) | — |
| API contract | [`api-contract.md`](./api-contract.md) | — |
| Data model | [`data-model.md`](./data-model.md) | — |
| UI flow | [`ui-flow.md`](./ui-flow.md) | — |

---

## Design, Testing, Review

| Artifact | Root path (`REPOSITORY_STRUCTURE`) | `docs/` path (`IMPLEMENTATION_PLAN`) |
|----------|-----------------------------------|----------------------------------------|
| Design notes | [`design-notes.md`](./design-notes.md) · [`design.md`](./design.md) | [`docs/design.md`](./docs/design.md) · [`docs/design-notes.md`](./docs/design-notes.md) |
| Testing notes | — | [`docs/testing-notes.md`](./docs/testing-notes.md) |
| Test strategy | [`test-strategy.md`](./test-strategy.md) | [`docs/test-strategy.md`](./docs/test-strategy.md) |
| Test results | [`test-results.md`](./test-results.md) | [`docs/test-results.md`](./docs/test-results.md) |
| Debugging notes | [`debugging-notes.md`](./debugging-notes.md) | [`docs/debugging-notes.md`](./docs/debugging-notes.md) |
| Code review | [`code-review-notes.md`](./code-review-notes.md) | [`docs/code-review-notes.md`](./docs/code-review-notes.md) |
| Review fixes | [`review-fixes.md`](./review-fixes.md) | — |

---

## Reflection & Submission Narrative

| Artifact | Root path | `docs/` path |
|----------|-----------|--------------|
| Reflection | [`reflection.md`](./reflection.md) | [`docs/reflection.md`](./docs/reflection.md) |
| PR description | [`pr-description.md`](./pr-description.md) · [`PR_DESCRIPTION.md`](./PR_DESCRIPTION.md) | [`docs/PR_DESCRIPTION.md`](./docs/PR_DESCRIPTION.md) · [`docs/pr-description.md`](./docs/pr-description.md) |
| AI usage summary | [`final-ai-usage-summary.md`](./final-ai-usage-summary.md) | [`docs/final-ai-usage-summary.md`](./docs/final-ai-usage-summary.md) |

---

## Application Code

| Layer | Path |
|-------|------|
| Backend API | [`backend/src/`](./backend/src/) |
| Integration tests | [`backend/src/tests/`](./backend/src/tests/) |
| Frontend SPA | [`frontend/src/`](./frontend/src/) |
| Database setup | [`database/setup-notes.md`](./database/setup-notes.md) |

---

## Quick Verification

```bash
cd backend && npm test          # 16 integration tests
cd backend && npm run verify:db # requires MONGODB_URI in backend/.env
cd frontend && npm run build
```

See [`docs/submission-checklist.md`](./docs/submission-checklist.md) for full pre-submit checklist.
