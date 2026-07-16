# UI Flow — Support Ticket Management System

> Implemented in `frontend/src/pages/`. Router: React Router v6.

---

## Navigation

```
Header: [Support Tickets]  [Ticket List]  [Create Ticket]
```

| Route | Page | Component |
|-------|------|-----------|
| `/` | Ticket list | `TicketListPage` |
| `/tickets/new` | Create ticket | `CreateTicketPage` |
| `/tickets/:id` | Ticket detail | `TicketDetailPage` |

---

## Flow 1 — Browse and filter

```
Ticket List
  ├── Load GET /api/tickets
  ├── Status dropdown → GET /api/tickets?status=
  ├── Search (debounced) → GET /api/tickets?q=
  └── Click title → /tickets/:id
```

**Empty states:** No tickets / no filter matches  
**Error state:** API unreachable → error banner

---

## Flow 2 — Create ticket

```
Create Ticket
  ├── Load GET /api/users (assignee + createdBy dropdowns)
  ├── Submit form → POST /api/tickets
  ├── On 400 → show validation errors
  └── On 201 → redirect /tickets/:id
```

**Defaults:** `createdBy` → john@example.com if seeded

---

## Flow 3 — View and edit ticket

```
Ticket Detail
  ├── GET /api/tickets/:id
  ├── GET /api/tickets/:id/allowed-transitions
  ├── Edit mode → PATCH /api/tickets/:id
  └── 404 → "Ticket not found" + back link
```

---

## Flow 4 — Change status

```
Detail page → Status section
  ├── Buttons = allowedTransitions only
  ├── Click → PATCH /api/tickets/:id/status
  ├── On 400 → error banner (backend message)
  └── On 200 → refresh status badge + transitions
```

Terminal states (`closed`, `cancelled`): no buttons shown.

---

## Flow 5 — Comments

```
Detail page → Comments section
  ├── List from ticket.comments (newest first)
  ├── Form: message + author (GET /users)
  └── Submit → POST /api/tickets/:id/comments → refetch ticket
```

---

## API mapping per page

| Page | APIs |
|------|------|
| List | `GET /tickets` |
| Create | `GET /users`, `POST /tickets` |
| Detail | `GET /tickets/:id`, `PATCH /tickets/:id`, `PATCH /tickets/:id/status`, `GET /allowed-transitions`, `POST /comments` |
