# Repository Structure

> Aligned with JS AI Capability Exercise submission layout.  
> **Reviewers:** start at [`SUBMISSION.md`](./SUBMISSION.md) for a complete artifact index.

This repo satisfies **both** naming conventions:

- **Root** — submission template filenames (`design-notes.md`, `pr-description.md`, …)
- **`docs/`** — `IMPLEMENTATION_PLAN.md` lifecycle paths (`design.md`, `PR_DESCRIPTION.md`, …)

Duplicate files at both locations are intentional so scanners find artifacts regardless of expected path.

```
C1_PROJECT/
├── README.md
├── SUBMISSION.md                       # Reviewer index (start here)
├── candidate-info.md
├── tool-workflow.md                    # Part A
├── requirements-analysis.md
├── acceptance-criteria.md
├── implementation-plan.md
├── IMPLEMENTATION_PLAN.md
├── design-notes.md
├── design.md                           # alias (same content as design-notes.md)
├── api-contract.md
├── data-model.md
├── ui-flow.md
├── test-strategy.md
├── test-results.md
├── debugging-notes.md
├── code-review-notes.md
├── review-fixes.md
├── pr-description.md
├── PR_DESCRIPTION.md                   # alias (same content as pr-description.md)
├── reflection.md
├── final-ai-usage-summary.md
├── frontend/                           # React SPA (src/)
├── backend/                            # Express API + tests (src/tests/)
├── database/
│   └── setup-notes.md
├── docs/                               # IMPLEMENTATION_PLAN lifecycle artifacts
│   ├── tool-workflow.md
│   ├── prompt-history.md
│   ├── requirements-analysis.md
│   ├── acceptance-criteria.md
│   ├── design.md
│   ├── design-notes.md                 # alias (same content as design.md)
│   ├── testing-notes.md
│   ├── test-strategy.md
│   ├── test-results.md
│   ├── debugging-notes.md
│   ├── code-review-notes.md
│   ├── reflection.md
│   ├── PR_DESCRIPTION.md
│   ├── pr-description.md               # alias (same content as PR_DESCRIPTION.md)
│   ├── final-ai-usage-summary.md
│   └── submission-checklist.md
├── prompts/
│   └── prompt-history.md
├── ai-prompts/
│   ├── planning.md
│   ├── design.md
│   ├── implementation.md
│   ├── testing.md
│   ├── debugging.md
│   ├── code-review.md
│   └── documentation.md
└── tool-specific/
    └── cursor-workflow/
        ├── project-context.md
        ├── spec.md
        ├── tasks.md
        ├── acceptance-criteria.md
        └── cursor-rules-or-instructions.md
```
