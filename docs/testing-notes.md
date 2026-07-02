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
