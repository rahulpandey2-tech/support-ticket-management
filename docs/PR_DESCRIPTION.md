# PR Description — Support Ticket Management System (Core)

## Summary

Implements the **Core** Support Ticket Management System: full-stack ticket CRUD, comments, keyword search, status filter, and a **backend-enforced status state machine** with integration tests. Includes complete lifecycle documentation for the JS AI Capability Exercise.

---

## Features Implemented

- Ticket list with status filter and debounced keyword search
- Create ticket form with validation error display
- Ticket detail with edit mode, status transitions, and comments
- State machine: 5 valid transitions; invalid moves return 400
- Seed script (5 users, 10 tickets, 8 comments)
- Jest + Supertest integration suite (16 tests)

---

## Technical Changes

### Backend
- Express 5 + TypeScript API with Zod validation
- Mongoose models: User, Ticket, Comment
- `statusMachine.ts` + `PATCH /tickets/:id/status`
- `GET /tickets/:id/allowed-transitions` for frontend
- App extracted to `app.ts` for Supertest

### Frontend
- React Router: list, create, detail pages
- API client with typed `ApiError`
- Status buttons driven by allowed-transitions API

### Database
- MongoDB (Atlas or local)
- Text index for search; indexes on status, updatedAt

---

## Database Changes

- Collections: `users`, `tickets`, `comments`
- Seed: `npm run seed` (destructive re-seed)
- No SQL migrations — Mongoose schemas + `syncIndexes()`

---

## Testing Done

```bash
cd backend && npm test
# Test Suites: 3 passed | Tests: 16 passed

npm run smoke:test      # E2E API flow (server required)
npm run verify:persistence
```

Manual UI smoke checklist documented in `docs/testing-notes.md`.

---

## AI Usage Summary

- **Cursor** used for planning, implementation, tests, debugging, and docs
- Step-by-step prompts against `IMPLEMENTATION_PLAN.md`
- AI mistakes corrected: Express 5 validation, `.env.example` secrets, Jest Memory Server setup
- Full prompt history: `prompts/prompt-history.md` and `ai-prompts/`

---

## Screenshots / Demo Notes

1. Start backend (`:3001`) and frontend (`:5173`)
2. Open ticket list — filter by "Open", search "password"
3. Create ticket → lands on detail page
4. Edit title → save → success banner
5. Click "Move to In Progress" → status badge updates
6. Add comment → appears in list
7. Try closed ticket — no status buttons available

---

## Known Limitations

- No authentication (Core scope)
- No user management UI — seeded users only
- No pagination or priority/assignee filters (Stretch)
- Frontend/backend types duplicated

---

## Future Improvements

- GitHub Actions CI
- Playwright E2E tests
- OpenAPI/Swagger docs
- Docker Compose for one-command setup
- JWT auth and role-based access
