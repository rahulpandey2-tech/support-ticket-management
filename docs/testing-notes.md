# Testing Notes — Support Ticket Management System

## Step 2.5 — MongoDB connection and indexes

**Date:** 2026-07-01  
**Database:** MongoDB Atlas (via `MONGODB_URI` in `backend/.env`)

### Verification command

```bash
cd backend
npm run verify:db
```

### Expected output

- `MongoDB connected: <host> / database: <name>`
- `Database indexes synced`
- Registered models: User, Ticket, Comment
- Index list per collection

### Indexes defined

| Model | Indexes |
|-------|---------|
| **User** | `_id`, `email` (unique) |
| **Ticket** | `_id`, `status`, `updatedAt`, `title` + `description` (text search) |
| **Comment** | `_id`, `ticketId` + `createdAt` |

### Server startup

On `npm run dev`, the server:

1. Connects to MongoDB Atlas
2. Syncs indexes via `syncIndexes()`
3. Starts Express on `PORT` (default 3001)

### Troubleshooting Atlas

If verification fails:

1. **IP whitelist** — In Atlas → Network Access, add your current IP (or `0.0.0.0/0` for dev only).
2. **Connection string** — `MONGODB_URI` in `backend/.env` must match Atlas format:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
3. **Password encoding** — Special characters in password must be URL-encoded.
4. **Run locally:** `cd backend && npm run verify:db`

---

## Step 2.6 — Seed script

**Date:** 2026-07-01  
**Command:** `npm run seed`

### Seed data

| Collection | Count | Notes |
|------------|-------|-------|
| Users | 5 | Roles: admin, agent, user |
| Tickets | 10 | Statuses: open, in_progress, resolved, closed, cancelled |
| Comments | 8 | Spread across multiple tickets |

### Behaviour

- Clears existing `users`, `tickets`, and `comments` before insert
- Safe to re-run for a fresh dataset
- Uses `@example.com` emails only

---

## Step 2.7 — Persistence after restart

**Date:** 2026-07-01  
**Command:** `npm run verify:persistence`

### Test procedure

1. Run `npm run seed` — note counts (5 users, 10 tickets, 8 comments)
2. Run `npm run verify:persistence` — confirm counts match
3. Stop the backend server (`Ctrl+C`)
4. (Optional) Restart MongoDB Atlas cluster or wait — Atlas data persists without restart
5. Run `npm run verify:persistence` again — counts must be unchanged
6. Start server with `npm run dev` — data still available

### Expected result

| Collection | Count after restart |
|------------|---------------------|
| Users | 5 |
| Tickets | 10 |
| Comments | 8 |

MongoDB Atlas persists data independently of the Node.js server. Stopping/restarting the API does not clear the database.

### Notes

- Never commit `backend/.env` — use `.env.example` for documentation only.

---

## Phase 5 — Status state machine (Steps 5.1–5.4)

**Date:** 2026-07-01  
**Module:** `backend/src/services/statusMachine.ts`  
**API:** `PATCH /api/tickets/:id/status`, `GET /api/tickets/:id/allowed-transitions`

### Transition map (5 valid transitions)

| From | To |
|------|-----|
| `open` | `in_progress` |
| `open` | `cancelled` |
| `in_progress` | `resolved` |
| `in_progress` | `cancelled` |
| `resolved` | `closed` |

Terminal states (`closed`, `cancelled`) allow no further transitions.

### Helpers

- `canTransition(from, to)` — returns boolean
- `getAllowedTransitions(from)` — returns array of valid next statuses
- `getInvalidTransitionMessage(from, to)` — e.g. `"Cannot transition from resolved to open"`

### Automated manual test script

```bash
cd backend
npm run seed          # fresh data
npm run dev           # terminal 1 — server on :3001
npm run test:state-machine   # terminal 2
```

### Test results (2026-07-01)

| Test | Expected | Result |
|------|----------|--------|
| `open` → `in_progress` | 200 | PASS |
| `in_progress` → `resolved` | 200 | PASS |
| `resolved` → `closed` | 200 | PASS |
| `open` → `cancelled` | 200 | PASS |
| `in_progress` → `cancelled` | 200 | PASS |
| `open` → `closed` | 400 | PASS |
| `open` → `resolved` | 400 | PASS |
| `closed` → `open` | 400 | PASS |
| `GET .../allowed-transitions` (open ticket) | 200, `["in_progress","cancelled"]` | PASS |

**Summary:** 9/9 passed

### Manual curl examples

```bash
# Valid transition
curl -X PATCH http://localhost:3001/api/tickets/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'

# Invalid transition (400)
curl -X PATCH http://localhost:3001/api/tickets/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"closed"}'

# Allowed next statuses
curl http://localhost:3001/api/tickets/<id>/allowed-transitions
```

Invalid transition response shape:

```json
{
  "error": "Cannot transition from open to closed"
}
```

---

## Phase 7 — End-to-end smoke test (Step 7.1)

**Date:** 2026-07-15  
**Covers:** Full ticket lifecycle via API + manual UI checklist

### Automated API smoke test

```bash
cd backend
npm run dev              # terminal 1
npm run smoke:test       # terminal 2
```

### API test results (2026-07-15)

| Step | Expected | Result |
|------|----------|--------|
| Health check | 200, `status: ok` | PASS |
| Load users | 200 | PASS |
| Create ticket | 201, status `open` | PASS |
| Ticket in list | Present in `GET /tickets` | PASS |
| Get detail | 200, correct title | PASS |
| Edit fields | 200, title updated | PASS |
| Status `open` → `in_progress` | 200 | PASS |
| Add comment | 201 | PASS |
| Comment on detail | Visible in `GET /tickets/:id` | PASS |

**Summary:** 9/9 passed

### Manual UI smoke test checklist

Prerequisites: backend on `:3001`, frontend on `:5173`, database seeded.

| # | Action | Expected |
|---|--------|----------|
| 1 | Open `http://localhost:5173` | Ticket list loads |
| 2 | Click **Create Ticket** | Form opens |
| 3 | Submit new ticket | Redirects to detail page |
| 4 | Return to list | New ticket visible |
| 5 | Open ticket detail | All fields displayed |
| 6 | Click **Edit**, change title, save | Success message, updated title |
| 7 | Click **Move to In Progress** | Status badge updates |
| 8 | Add a comment and submit | Comment appears in list |
| 9 | Filter list by status / search keyword | Results update |
| 10 | Try invalid status (e.g. closed ticket) | No status buttons or error shown |

### Persistence after restart (Step 7.1)

1. Note ticket/comment counts: `npm run verify:persistence`
2. Stop backend (`Ctrl+C`) and restart: `npm run dev`
3. Run `npm run verify:persistence` again — counts unchanged
4. Refresh frontend — previously created tickets still visible

**Result (2026-07-15):** Persistence verified — Users: 5, Tickets: 10+, Comments: 8+

---

## Phase 7 — Security check (Step 7.4)

**Date:** 2026-07-15

| Check | Status |
|-------|--------|
| `.env` in root `.gitignore` | OK |
| `.env` in `frontend/.gitignore` | Fixed |
| `backend/.env.example` uses placeholders only | Fixed |
| `prompts/prompt-history.md` — no passwords/tokens | OK |
| Real credentials only in local `backend/.env` (not committed) | OK |

**Note:** If Atlas credentials were previously committed in `.env.example`, rotate the database user password in MongoDB Atlas.

---

## Phase 8 — Integration tests (Steps 8.1–8.6)

**Date:** 2026-07-15  
**Stack:** Jest + Supertest + MongoDB Memory Server  
**Command:** `cd backend && npm test`

### Infrastructure (8.1)

- Express app extracted to `src/app.ts` for Supertest
- In-memory MongoDB via `mongodb-memory-server` (no Atlas needed for tests)
- Global setup/teardown; collections cleared between tests

### Test suites

| File | Coverage |
|------|----------|
| `statusTransitions.test.ts` | All 5 valid transitions; 5 invalid (400 + error message) |
| `tickets.create.test.ts` | Missing title/description → 400; valid payload → 201 |
| `tickets.searchFilter.test.ts` | `?q=`, `?status=`, combined filter |

### Results (2026-07-15)

```
Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
Time:        ~10s
```

### Valid transitions tested (8.2)

- `open` → `in_progress`
- `in_progress` → `resolved`
- `resolved` → `closed`
- `open` → `cancelled`
- `in_progress` → `cancelled`

### Invalid transitions tested (8.3)

| Transition | HTTP | Error message |
|------------|------|---------------|
| `open` → `closed` | 400 | Cannot transition from open to closed |
| `open` → `resolved` | 400 | Cannot transition from open to resolved |
| `resolved` → `in_progress` | 400 | Cannot transition from resolved to in_progress |
| `closed` → `open` | 400 | Cannot transition from closed to open |
| `cancelled` → `open` | 400 | Cannot transition from cancelled to open |
