# AI Prompts — Implementation

> Backend and frontend build prompts (Phases 1–6).

---

## Scaffolding

> Phase 1 — scaffold backend with Express + TypeScript and frontend with React + Vite. Add health check GET /api/health, CORS for localhost:5173, .env.example files. Keep it minimal.

**Accepted:** Folder structure and health endpoint.

---

## Database switch

> I want to switch from Prisma/SQLite to MongoDB with Mongoose. Remove Prisma files, add Mongoose models for User Ticket Comment matching the spec, connection in config/database.ts, and update project-context. Keep the same entity fields.

**Accepted:** Mongoose schemas with indexes.  
**Changed:** Kept seed script pattern but rewrote for Mongoose `create()`.

---

## Ticket APIs

> Step 4.1 — implement GET /api/tickets. Return tickets sorted by updatedAt desc, populate assignedTo and createdBy with name email role. Follow the route → validate → controller → service pattern from project-context.

**Accepted:** Layered structure.

---

## State machine

> Step 4.5 and 5.1 — create statusMachine.ts with the 5 allowed transitions from the exercise. Integrate into PATCH /api/tickets/:id/status. On invalid transition return 400 with message "Cannot transition from X to Y". Status must NOT be updatable via generic PATCH.

**Accepted:** Separate status endpoint.  
**Validated:** Checked updateTicketSchema does not include status field.

---

## Express validation fix

> Getting this error when I hit GET /api/tickets?status=open:
> `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`
> We're on Express 5. Fix validate.ts without breaking Zod validation.

**Accepted:** `req.validated` pattern.  
**Changed:** Updated all controllers to read from `req.validated` instead of `req.query` directly.

---

## Frontend Phase 6

> complete phase 6 — build all frontend pages: ticket list with filter and debounced search, create ticket, detail with edit mode, status buttons from allowed-transitions API, comments section, error and empty states. Use React Router. Match existing backend API.

**Accepted:** Full UI.  
**Changed:** Fixed FormEvent type-only import for Vite build (`import { type FormEvent }`).
