# Specification — Support Ticket Management System

> Technical spec for implementation. Aligned with [`docs/requirements-analysis.md`](../../docs/requirements-analysis.md) and [`project-context.md`](./project-context.md).

---

## 1. Functional Requirements

### F1 — Create ticket
- User fills form: title, description, priority, assignee (optional), creator (seeded user).
- System saves ticket with `status = open`.
- On success, redirect to ticket detail page.

### F2 — List tickets
- Display all tickets from database.
- Show: title, status, priority, assignee name, created/updated dates.
- Each row links to detail page.
- Support keyword search and status filter on same view.

### F3 — View ticket detail
- Show full ticket metadata and all comments.
- Comments ordered newest first.
- Show 404 state when ticket does not exist.

### F4 — Update ticket fields
- Edit title, description, priority, assignee.
- Must **not** change `status` through this action.
- Persist changes and refresh view.

### F5 — Change ticket status
- User selects a target status from allowed next statuses only.
- Backend validates transition via state machine.
- Invalid transitions show error message; UI does not update status.

### F6 — Add comment
- User submits non-empty message on detail page.
- Comment saved with author (seeded user) and timestamp.
- Comment list refreshes after success.

### F7 — Keyword search
- Search `title` and `description` (case-insensitive).
- Works together with status filter.

### F8 — Filter by status
- Filter list to one status: `open`, `in_progress`, `resolved`, `closed`, `cancelled`, or all.

### F9 — Data persistence
- All data stored in SQLite via Prisma.
- Survives application and process restart.

### F10 — Validation & errors
- Backend rejects invalid input with 400 and clear message.
- Frontend displays API errors, loading states, and empty states.

---

## 2. API Specification

Base URL: `http://localhost:3001/api`  
Content-Type: `application/json`

### Shared types

```typescript
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
type Priority = 'low' | 'medium' | 'high';
type Role = 'admin' | 'agent' | 'user';

interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface Comment {
  id: number;
  message: string;
  createdAt: string;
  createdBy: UserSummary;
}

interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: UserSummary | null;
  createdBy: UserSummary;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

interface ErrorResponse {
  error: string;
  details?: { field: string; message: string }[];
}
```

---

### GET `/health`

**Response 200**
```json
{ "status": "ok" }
```

---

### GET `/tickets`

List tickets with optional filters.

**Query parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | TicketStatus | No | Filter by status |
| `q` | string | No | Keyword search in title and description |

**Response 200**
```json
[
  {
    "id": 1,
    "title": "Login page broken",
    "description": "Users cannot reset password",
    "priority": "high",
    "status": "open",
    "assignedTo": { "id": 2, "name": "Jane Agent", "email": "jane@example.com", "role": "agent" },
    "createdBy": { "id": 1, "name": "John User", "email": "john@example.com", "role": "user" },
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-01T10:00:00.000Z"
  }
]
```

**Notes:** Ordered by `updatedAt` descending. Invalid `status` query → 400.

---

### GET `/tickets/:id`

**Response 200** — Ticket with comments (newest first)

```json
{
  "id": 1,
  "title": "Login page broken",
  "description": "Users cannot reset password",
  "priority": "high",
  "status": "open",
  "assignedTo": { "id": 2, "name": "Jane Agent", "email": "jane@example.com", "role": "agent" },
  "createdBy": { "id": 1, "name": "John User", "email": "john@example.com", "role": "user" },
  "createdAt": "2026-07-01T10:00:00.000Z",
  "updatedAt": "2026-07-01T10:00:00.000Z",
  "comments": [
    {
      "id": 1,
      "message": "Investigating now",
      "createdAt": "2026-07-01T11:00:00.000Z",
      "createdBy": { "id": 2, "name": "Jane Agent", "email": "jane@example.com", "role": "agent" }
    }
  ]
}
```

**Response 404**
```json
{ "error": "Ticket not found" }
```

---

### POST `/tickets`

**Request body**
```json
{
  "title": "Login page broken",
  "description": "Users cannot reset password",
  "priority": "high",
  "assignedToId": 2,
  "createdById": 1
}
```

| Field | Required | Rules |
|-------|----------|-------|
| title | Yes | Non-empty, max 200 chars |
| description | Yes | Non-empty |
| priority | Yes | `low` \| `medium` \| `high` |
| assignedToId | No | Must exist in User table if provided |
| createdById | Yes | Must exist in User table |

**Response 201** — Created ticket (status always `open`)

**Response 400** — Validation error

---

### PATCH `/tickets/:id`

Update ticket fields. **Status is not accepted in this endpoint.**

**Request body** (all fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "assignedToId": 3
}
```

**Response 200** — Updated ticket  
**Response 400** — Validation error  
**Response 404** — Ticket not found

---

### PATCH `/tickets/:id/status`

Change status via state machine only.

**Request body**
```json
{ "status": "in_progress" }
```

**Response 200** — Updated ticket with new status

**Response 400** — Invalid transition
```json
{ "error": "Invalid status transition from open to closed" }
```

**Response 404** — Ticket not found

---

### GET `/tickets/:id/allowed-transitions`

Returns valid next statuses for the ticket's current state.

**Response 200**
```json
{ "currentStatus": "open", "allowedTransitions": ["in_progress", "cancelled"] }
```

**Response 404** — Ticket not found

---

### POST `/tickets/:id/comments`

**Request body**
```json
{
  "message": "Customer confirmed the fix works",
  "createdById": 1
}
```

| Field | Required | Rules |
|-------|----------|-------|
| message | Yes | Non-empty string |
| createdById | Yes | Must exist in User table |

**Response 201** — Created comment  
**Response 400** — Validation error  
**Response 404** — Ticket not found

---

### GET `/users`

List seeded users for dropdowns.

**Response 200**
```json
[
  { "id": 1, "name": "John User", "email": "john@example.com", "role": "user" },
  { "id": 2, "name": "Jane Agent", "email": "jane@example.com", "role": "agent" }
]
```

---

## 3. Status State Machine

| From | Allowed targets |
|------|-----------------|
| `open` | `in_progress`, `cancelled` |
| `in_progress` | `resolved`, `cancelled` |
| `resolved` | `closed` |
| `closed` | *(none — terminal)* |
| `cancelled` | *(none — terminal)* |

Implementation: `backend/src/services/statusMachine.ts`

---

## 4. UI Pages & Navigation

```
┌─────────────────────────────────────────────────────────┐
│  Header: Support Tickets    [List] [Create Ticket]    │
└─────────────────────────────────────────────────────────┘

/  (TicketListPage)
├── Search input (q)
├── Status filter dropdown
└── Ticket table → click row → /tickets/:id

/tickets/new  (CreateTicketPage)
├── Form: title, description, priority, assignee
└── Submit → POST /tickets → redirect /tickets/:id

/tickets/:id  (TicketDetailPage)
├── Ticket fields (view + edit mode)
├── Status buttons (allowed transitions only)
├── Comments list
└── Add comment form
```

### Page behaviour summary

| Route | Component | APIs used |
|-------|-----------|-----------|
| `/` | TicketListPage | GET `/tickets?status=&q=` |
| `/tickets/new` | CreateTicketPage | GET `/users`, POST `/tickets` |
| `/tickets/:id` | TicketDetailPage | GET `/tickets/:id`, PATCH `/tickets/:id`, PATCH `/tickets/:id/status`, GET `/tickets/:id/allowed-transitions`, POST `/tickets/:id/comments` |

---

## 5. Validation Rules

### Ticket — create

| Field | Rule | Error |
|-------|------|-------|
| title | Required, trim, 1–200 chars | 400 |
| description | Required, trim, min 1 char | 400 |
| priority | Must be valid enum | 400 |
| createdById | Required, user must exist | 400 |
| assignedToId | Optional, user must exist if set | 400 |

### Ticket — update (PATCH)

| Field | Rule | Error |
|-------|------|-------|
| title | If provided: non-empty, max 200 | 400 |
| description | If provided: non-empty | 400 |
| priority | If provided: valid enum | 400 |
| assignedToId | If provided: user must exist or null | 400 |
| status | **Rejected if sent** — use status endpoint | 400 |

### Ticket — status change

| Rule | Error |
|------|-------|
| Target status must be valid enum | 400 |
| Transition must be allowed by state machine | 400 |
| Ticket must exist | 404 |

### Comment — create

| Field | Rule | Error |
|-------|------|-------|
| message | Required, trim, min 1 char | 400 |
| createdById | Required, user must exist | 400 |
| ticketId (path) | Ticket must exist | 404 |

### Query — list tickets

| Param | Rule | Error |
|-------|------|-------|
| status | If provided: valid TicketStatus | 400 |
| q | If provided: string, trim | — |

---

## 6. Database Schema (Prisma)

```prisma
enum Role {
  admin
  agent
  user
}

enum Priority {
  low
  medium
  high
}

enum TicketStatus {
  open
  in_progress
  resolved
  closed
  cancelled
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  role      Role
  ticketsCreated  Ticket[]  @relation("CreatedBy")
  ticketsAssigned Ticket[]  @relation("AssignedTo")
  comments  Comment[]
}

model Ticket {
  id           Int          @id @default(autoincrement())
  title        String
  description  String
  priority     Priority
  status       TicketStatus @default(open)
  assignedToId Int?
  assignedTo   User?        @relation("AssignedTo", fields: [assignedToId], references: [id])
  createdById  Int
  createdBy    User         @relation("CreatedBy", fields: [createdById], references: [id])
  comments     Comment[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Comment {
  id          Int      @id @default(autoincrement())
  message     String
  ticketId    Int
  ticket      Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  createdById Int
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## 7. Testing Scope (Core)

| Area | Test type | Required |
|------|-----------|----------|
| State machine — 5 valid transitions | Integration | Yes |
| State machine — invalid transitions | Integration | Yes |
| Create ticket validation | Integration | Yes |
| Search and status filter | Integration | Recommended |
| State machine pure functions | Unit | Stretch |

---

## 8. Out of Scope (this spec — Core only)

- Authentication / login
- User CRUD UI
- Pagination, sorting, priority/assignee filters
- Swagger, Docker, CI

---

*Document: Step 0.4 — Specification. Update when implementation diverges from design.*
