# Review Fixes — Support Ticket Management System

> Changes made after code review (Phase 7). Details in [code-review-notes.md](./code-review-notes.md).

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 1 | Real Atlas URI in `backend/.env.example` | High | Replaced with localhost placeholder |
| 2 | `frontend/.gitignore` missing `.env` | Medium | Added `.env` patterns |
| 3 | Express 5 `req.query` read-only crash | High | `req.validated` pattern (Phase 4 debug) |
| 4 | Duplicate frontend/backend types | Medium | Accepted for Core; documented |
| 5 | Jest Memory Server per-file timeout | Medium | `globalSetup` / `globalTeardown` |
| 6 | `FormEvent` import build error | Low | Type-only import in frontend pages |

**Rejected (not bugs):** No auth, no pagination — out of Core scope.
