# Test Strategy — Support Ticket Management System

## Test Scope

| Area | In scope (Core) | Out of scope |
|------|-----------------|--------------|
| Status state machine | Valid + invalid transitions via API | Unit tests for pure functions (Stretch) |
| Ticket creation | Validation errors + success | Load/performance testing |
| Search & filter | `?q=` and `?status=` | Pagination, assignee filter |
| Frontend | Manual E2E checklist | Cypress/Playwright (Stretch) |
| Auth | — | Login, JWT, protected routes |

---

## Unit Tests

Not implemented in Core. State machine logic (`statusMachine.ts`) is covered indirectly via integration tests. Stretch item 11.5 would add direct unit tests for `canTransition()`.

---

## API / Integration Tests (mandatory)

**Tooling:** Jest + Supertest + MongoDB Memory Server  
**Command:** `cd backend && npm test`  
**Location:** `backend/src/tests/`

| File | Tests |
|------|-------|
| `statusTransitions.test.ts` | 5 valid + 5 invalid transitions |
| `tickets.create.test.ts` | Missing title/description → 400; valid → 201 |
| `tickets.searchFilter.test.ts` | Search, filter, combined query |

**Total:** 16 tests (latest run: all passing)

### Why Memory Server

- No dependency on Atlas or local MongoDB for CI/reviewers
- Fresh database per test run; collections cleared between tests
- Same Mongoose models and indexes as production code path

---

## Manual / Script Tests

| Script | Purpose |
|--------|---------|
| `npm run test:state-machine` | Live API state machine checks (needs running server) |
| `npm run smoke:test` | Full create → edit → status → comment flow |
| `npm run verify:persistence` | Data survives process restart |

Documented in [testing-notes.md](./testing-notes.md).

---

## Edge Cases Covered in Tests

- Invalid transition from terminal state (`closed` → `open`)
- Skip intermediate states (`open` → `resolved`)
- Empty required fields on create
- Text search with status filter combined

## Edge Cases Not Covered (and why)

| Case | Reason |
|------|--------|
| Concurrent status updates | Core scope; would need transaction/locking tests |
| Invalid ObjectId format | Mongoose cast error → 404; not explicitly asserted |
| Very long title (>200 chars) | Zod max length; single test would be redundant |
| Network timeout on frontend | Manual/error banner UI; no E2E automation |

---

## Test Results

Latest documented run: **2026-07-15** — see [testing-notes.md](./testing-notes.md) Phase 8 section.

```
Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
```
