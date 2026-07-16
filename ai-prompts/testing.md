# AI Prompts — Testing

> Phase 5, 7, and 8 testing prompts.

---

## Manual state machine tests

> Phase 5 step 5.4 — write a script to manually test all valid and invalid status transitions against the running API. Document results in testing-notes.md. Use the seeded tickets.

**Accepted:** `testStateMachine.ts` + documentation.  
**Result:** 9/9 passed.

---

## E2E smoke test

> complete phase 7 — document end-to-end smoke test: create ticket, list, detail, edit, status change, comment, persistence after restart. Add an automated API smoke script if useful.

**Accepted:** `smokeTest.ts` + UI checklist in testing-notes.  
**Result:** 9/9 API steps passed.

---

## Jest integration tests

> complete phase 8 — set up Jest + Supertest with MongoDB Memory Server. Write integration tests for: all 5 valid transitions, 5 invalid transitions with 400 and error message, create ticket validation, search and filter. Extract app to app.ts for supertest. npm test must run all tests.

**Accepted:** 16 tests across 3 suites.  
**Changed:** Added globalSetup/globalTeardown — per-file Memory Server was timing out on 3rd suite. Added `--forceExit` because Jest hung on open handles.

---

## Test failure follow-up

> jest says 13 passed 3 failed — MongoMemoryServer Instance failed to start within 10000ms on tickets.searchFilter.test.ts. Only fix the test infrastructure, don't change production code.

**Accepted:** Single shared memory server in globalSetup, launchTimeout 120000.
