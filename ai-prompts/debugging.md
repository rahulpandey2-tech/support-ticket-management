# AI Prompts — Debugging & Errors

> Real issues encountered and how I prompted Cursor to fix them.

---

## Atlas connection failed

> npm run verify:db fails with:
> `querySrv ECONNREFUSED _mongodb._tcp.cluster0.sewzrz9.mongodb.net`
> I'm on Windows using mongodb+srv URI in .env. What should I try?

**AI suggested:** Use standard `mongodb://` connection string from Atlas (Direct Connection), check IP whitelist, URL-encode password.

**What I did:** Switched to non-SRV URI. Connected successfully. Did not paste real password into prompt — described error only.

---

## Wrong database name

> mongoose connects but my data goes to database "test" instead of support_tickets. Here's my URI format (redacted): mongodb+srv://USER:***@cluster.net/?retryWrites=true — what's wrong?

**AI suggested:** Add `/support_tickets` before the `?` in the connection string.

**Validated:** `verify:persistence` showed correct database name after fix.

---

## API crashes on list with query params

> backend crashes when I filter tickets:
> `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`
> at validate.ts line 25
> using express 5.2 and zod. show me the fix.

**Root cause:** Middleware did `req.query = result.data`.  
**Fix:** Store on `req.validated.query` instead.

---

## Secrets in repo

> phase 7 security check — grep my repo for anything that looks like real credentials. especially .env.example

**Found:** Real Atlas username in backend/.env.example.  
**Fix:** Replaced with localhost placeholder. Added .env to frontend/.gitignore.

---

## Frontend build error

> npm run build in frontend fails:
> `'FormEvent' is a type and must be imported using a type-only import when verbatimModuleSyntax is enabled`
> in CreateTicketPage and TicketDetailPage

**Fix:** `import { useState, type FormEvent } from 'react'`

---

## Jest won't exit

> all 16 tests pass but jest hangs forever with "did not exit one second after test run". mongodb-memory-server + mongoose. how to fix without removing tests?

**Fix:** globalSetup/globalTeardown for memory server, mongoose.disconnect in afterAll, `jest --runInBand --forceExit`.
