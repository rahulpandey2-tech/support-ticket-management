# Debugging Notes — Support Ticket Management System

> Issues encountered during development, how they were investigated, and final fixes.

---

## Issue 1 — Git not found on PATH (Windows)

### Problem
Running `git init` from the terminal failed with "git is not recognized."

### How I Investigated
Checked whether Git was installed; it was not on the system PATH after a fresh Windows setup.

### How AI Helped
Cursor suggested installing Git for Windows and verifying with `git --version`.

### What I Validated
Installed Git manually, reopened terminal, confirmed `git init` and remote push worked.

### Final Fix
Installed Git; completed repository initialization and linked GitHub remote manually.

---

## Issue 2 — MongoDB Atlas `querySrv ECONNREFUSED`

### Problem
`npm run verify:db` failed with DNS SRV lookup error when using `mongodb+srv://` connection string.

```
Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.xxxxx.mongodb.net
```

### How I Investigated
- Confirmed internet connectivity
- Tested connection string format in Atlas dashboard
- Tried standard `mongodb://` URI instead of SRV

### How AI Helped
Cursor explained SRV DNS issues on some networks/Windows setups and suggested using the non-SRV connection string from Atlas (Direct Connection).

### What I Validated
Switched `MONGODB_URI` in `backend/.env` to the standard `mongodb://` format with explicit host list; `verify:db` connected successfully.

### Final Fix
Use `mongodb://` connection string in `.env` (never commit). Documented troubleshooting in `docs/testing-notes.md`.

---

## Issue 3 — Data written to `test` database instead of `support_tickets`

### Problem
After connecting to Atlas, collections appeared under database name `test` instead of the intended app database.

### How I Investigated
Checked `mongoose.connection.name` in verify script output; URI lacked database name in path.

### How AI Helped
Cursor pointed out the URI must include `/support_tickets` before query params:
`mongodb://.../support_tickets?retryWrites=true&w=majority`

### What I Validated
Re-ran `npm run seed` and `npm run verify:persistence` — counts correct under `support_tickets`.

### Final Fix
Added database name to `MONGODB_URI` path segment.

---

## Issue 4 — Express 5 read-only `req.query` crash

### Problem
API routes using query validation crashed on startup/first request:

```
TypeError: Cannot set property query of #<IncomingMessage> which has only a getter
    at validate.ts
```

### How I Investigated
Stack trace pointed to validation middleware reassigning `req.query` after Zod parse. Express 5 made `req.query` read-only.

### How AI Helped
Suggested storing parsed values on a custom `req.validated` object instead of mutating `req.query` / `req.body`.

### What I Validated
- Updated `middleware/validate.ts` to use `req.validated`
- Added `types/express.d.ts` for TypeScript
- Updated controllers to read from `req.validated`
- Re-tested list tickets with `?status=` and `?q=` filters

### Final Fix
`req.validated = { query, body, params }` pattern — no reassignment of read-only Express properties.

---

## Issue 5 — Real credentials in `.env.example`

### Problem
During Phase 7 security review, `backend/.env.example` contained a real Atlas username and cluster hostname.

### How I Investigated
Grep for `mongodb+srv://` and credential patterns across the repo.

### How AI Helped
Flagged as high-severity; recommended placeholder URI and password rotation if previously pushed.

### What I Validated
Replaced with `mongodb://localhost:27017/support_tickets`; confirmed `.env` still gitignored.

### Final Fix
Placeholder-only `.env.example`. **Action:** rotate Atlas password if old file was ever committed to GitHub.

---

## Issue 6 — Jest hanging after tests complete

### Problem
`npm test` reported all 16 tests passed but Jest did not exit — open handles from Mongoose/MongoMemoryServer.

### How I Investigated
Jest warning: "Jest did not exit one second after the test run has completed." Tried `afterAll` disconnect in setup file.

### How AI Helped
Suggested global setup/teardown for MongoMemoryServer (single instance), per-suite `mongoose.disconnect()`, and `--forceExit` for CI reliability.

### What I Validated
Refactored to `globalSetup.ts` / `globalTeardown.ts`; tests pass in ~10s with clean exit.

### Final Fix
`jest --runInBand --forceExit` in `package.json`; documented in `docs/testing-notes.md`.

---

## Issue 7 — MongoMemoryServer timeout on third test file

### Problem
First test run: 13 passed, 3 failed — `Instance failed to start within 10000ms` because each test file spawned its own memory server.

### How I Investigated
Jest `setupFilesAfterEnv` runs per file; three suites = three server startups.

### How AI Helped
Moved server creation to `globalSetup.ts` (once per run), increased `launchTimeout` to 120s.

### What I Validated
All 3 suites, 16 tests pass consistently.

### Final Fix
Single shared MongoMemoryServer via global setup.

---

## Issue 8 — Frontend TypeScript `FormEvent` import error

### Problem
`npm run build` failed:
```
'FormEvent' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

### How I Investigated
Error in `CreateTicketPage.tsx` and `TicketDetailPage.tsx`.

### How AI Helped
Suggested `import { type FormEvent } from 'react'`.

### What I Validated
`npm run build` and `npm run lint` pass.

### Final Fix
Type-only imports for `FormEvent`.

---

## Summary

| Issue | Root cause | Lesson |
|-------|------------|--------|
| Atlas DNS | SRV lookup blocked | Use standard URI or fix DNS |
| Wrong DB name | Missing path in URI | Always include db name in connection string |
| Express 5 crash | Mutating read-only `req.query` | Use `req.validated` pattern |
| Secrets in example | Copy-paste from real `.env` | Only placeholders in tracked files |
| Jest hang | Open MongoDB handles | Global setup + forceExit |
| TS build | verbatimModuleSyntax | `import type` for types |
