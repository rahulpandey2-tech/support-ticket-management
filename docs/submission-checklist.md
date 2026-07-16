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

- [x] README complete
- [x] tool-workflow.md (Part A)
- [x] requirements-analysis.md
- [x] acceptance-criteria.md (checked off)
- [x] prompt-history.md + ai-prompts/
- [x] debugging-notes.md
- [x] reflection.md
- [x] PR_DESCRIPTION.md
- [x] design.md
- [x] candidate-info.md

## Submission

- [ ] Push latest to GitHub
- [ ] Repo accessible to competency team
- [ ] Fill online submission form
- [ ] Link to specific commits for AI mistake fixes (see debugging-notes.md)
