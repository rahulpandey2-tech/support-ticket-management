# Pre-Submission Verification Checklist

**Date:** 2026-07-16

## Application

- [ ] `cd backend && npm run dev` — server starts, MongoDB connects
- [ ] `cd frontend && npm run dev` — UI loads at localhost:5173
- [ ] Create ticket via UI → appears in list
- [ ] Edit ticket, change status, add comment
- [ ] Search and status filter work
- [ ] Invalid status shows error message

## Tests

- [ ] `cd backend && npm test` — 16/16 pass
- [ ] `npm run build` in frontend — no errors

## Security

- [ ] No `.env` files committed
- [ ] `.env.example` has placeholders only
- [ ] No real passwords in prompt history

## Documentation

- [x] README complete + [SUBMISSION.md](../SUBMISSION.md) reviewer index
- [x] tool-workflow.md (Part A) — root + `docs/tool-workflow.md`
- [x] requirements-analysis.md — root + `docs/requirements-analysis.md`
- [x] acceptance-criteria.md — root + `docs/acceptance-criteria.md` + `tool-specific/`
- [x] prompt-history — `prompts/` + `docs/prompt-history.md` + `ai-prompts/`
- [x] debugging-notes.md — root + `docs/debugging-notes.md`
- [x] reflection.md — root + `docs/reflection.md`
- [x] PR description — root (`pr-description.md`, `PR_DESCRIPTION.md`) + `docs/`
- [x] design — root (`design-notes.md`, `design.md`) + `docs/design.md`
- [x] candidate-info.md

## Submission

- [ ] Push latest to GitHub
- [ ] Repo accessible to competency team
- [ ] Fill online submission form
- [ ] Link to specific commits for AI mistake fixes (see debugging-notes.md)
