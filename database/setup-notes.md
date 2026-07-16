# Database Setup Notes

**Database:** MongoDB (local or Atlas)  
**ODM:** Mongoose  
**App database name:** `support_tickets`

---

## Environment

```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/support_tickets
# Atlas example:
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/support_tickets?retryWrites=true&w=majority
```

**Important:** Include `/support_tickets` in the URI path so data is not written to the default `test` database.

---

## Setup steps

```bash
cd backend
npm install
copy .env.example .env    # edit MONGODB_URI
npm run verify:db         # connect + sync indexes
npm run seed              # 5 users, 10 tickets, 8 comments
```

---

## Schema / migrations

No SQL migrations. Schemas defined in:

- `backend/src/models/User.ts`
- `backend/src/models/Ticket.ts`
- `backend/src/models/Comment.ts`

Indexes synced on startup via `syncIndexes()` in `config/database.ts`.

---

## Seed data

**Script:** `backend/src/scripts/seed.ts`  
**Command:** `npm run seed`

Clears `users`, `tickets`, `comments` then inserts fresh sample data. Safe to re-run.

---

## Verify persistence

```bash
npm run verify:persistence
```

Stop/restart the Node server — counts should remain unchanged (Atlas persists independently).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `querySrv ECONNREFUSED` | Use standard `mongodb://` URI from Atlas Direct Connection |
| Data in `test` DB | Add `/support_tickets` to connection string |
| IP blocked | Atlas → Network Access → add your IP |

See [debugging-notes.md](../debugging-notes.md) for full investigation notes.
