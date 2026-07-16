# Code Review Notes — Support Ticket Management System

**Date:** 2026-07-15  
**Reviewer:** Self-review (AI-assisted, human-approved fixes)  
**Scope:** Backend API, frontend UI, config, and documentation after Phases 1–6

---

## Summary

The codebase follows a clear layered structure (routes → validators → controllers → services → Mongoose). Core requirements are met: ticket CRUD, search/filter, state machine enforcement, and comments. Two security issues were found and fixed during this review.

| Severity | Found | Fixed |
|----------|-------|-------|
| High | 1 | 1 |
| Medium | 2 | 2 |
| Low | 3 | 1 |

---

## Findings

### HIGH — Real credentials in `backend/.env.example`

**Issue:** `.env.example` contained an Atlas connection string with a real username and cluster hostname instead of placeholders.

**Risk:** Credentials could be committed to a public repository.

**Fix:** Replaced with `mongodb://localhost:27017/support_tickets` and kept Atlas format as a commented template with `<user>` / `<password>` placeholders.

**Action for maintainer:** If the old URI was ever pushed to GitHub, rotate the Atlas database user password.

---

### MEDIUM — `frontend/.gitignore` did not exclude `.env`

**Issue:** Root `.gitignore` covers `.env`, but the frontend folder had its own `.gitignore` without `.env` entries.

**Risk:** `frontend/.env` could be committed if git is run from the frontend directory with incomplete ignore rules.

**Fix:** Added `.env`, `.env.local`, and `.env.*.local` to `frontend/.gitignore`.

---

### MEDIUM — Duplicate type definitions (frontend vs backend)

**Issue:** `TicketResponse`, enums, etc. are duplicated in `frontend/src/types` and `backend/src/types`.

**Impact:** Types can drift if API shapes change on one side only.

**Decision:** Accepted for Core scope. A shared package would add complexity. Documented here; sync manually when API changes.

---

### LOW — `npm test` placeholder (resolved in Phase 8)

**Issue:** Backend `npm test` was a placeholder until Phase 8.

**Status:** Resolved — Jest + Supertest suite with 16 passing tests.

---

### LOW — `project-context.md` early history mentions Prisma/SQLite

**Issue:** Older prompt-history entries mention Prisma/SQLite; implementation uses MongoDB + Mongoose.

**Impact:** Confusing for new sessions if only prompt history is read.

**Decision:** `project-context.md` and `README.md` are correct. No code change; historical log kept as-is.

---

### LOW — No request rate limiting or auth

**Issue:** API is open without authentication.

**Decision:** Out of Core scope per requirements. Noted for Stretch (Phase 11).

---

## What looks good

- **State machine:** Enforced only in `updateTicketStatus`; generic `PATCH /tickets/:id` cannot change status.
- **Validation:** Zod on all inputs; Express 5 `req.validated` pattern avoids read-only `req.query` issues.
- **Error handling:** Consistent `AppError` + `errorHandler`; frontend `ApiError` surfaces backend messages.
- **Frontend:** Allowed status buttons driven by `GET /allowed-transitions`; invalid transitions show backend error text.
- **Seed data:** Uses `@example.com` only; safe to re-run.

---

## Fixes applied in this review

| File | Change |
|------|--------|
| `backend/.env.example` | Placeholder URI instead of real Atlas credentials |
| `frontend/.gitignore` | Added `.env` patterns |
| `docs/code-review-notes.md` | This document |
| `docs/testing-notes.md` | E2E smoke test section (Phase 7.1) |
| `README.md` | Complete setup and test instructions |
| `backend/src/scripts/smokeTest.ts` | Automated E2E API smoke script |

---

## Follow-up (Stretch)

- [x] Replace `npm test` placeholder with Jest integration tests
- [ ] Consider shared types package if API surface grows
- [ ] Optional: ESLint/Prettier alignment across frontend and backend
