# API Contract — Support Ticket Management System

> Canonical API reference. Full spec: [`tool-specific/cursor-workflow/spec.md`](./tool-specific/cursor-workflow/spec.md)

**Base URL:** `http://localhost:3001/api`  
**Content-Type:** `application/json`

---

## GET `/health`

**Purpose:** Health check

**Response 200**
```json
{ "status": "ok" }
```

---

## GET `/tickets`

**Purpose:** List tickets with optional search and filter

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `status` | enum | Filter by ticket status |
| `q` | string | Keyword search in title/description |

**Response 200:** `TicketResponse[]`

---

## POST `/tickets`

**Purpose:** Create ticket (always `status: open`)

**Request**
```json
{
  "title": "Cannot login",
  "description": "Users see blank screen after login",
  "priority": "high",
  "assignedToId": "optional ObjectId or null",
  "createdById": "required ObjectId"
}
```

**Response 201:** `TicketResponse`  
**Response 400:** `{ "error": "Validation failed", "details": [...] }`

---

## GET `/tickets/:id`

**Purpose:** Ticket detail with comments

**Response 200:** `TicketResponse` (includes `comments[]`)  
**Response 404:** `{ "error": "Ticket not found" }`

---

## PATCH `/tickets/:id`

**Purpose:** Update fields only — **not status**

**Request** (at least one field)
```json
{
  "title": "Updated title",
  "description": "Updated text",
  "priority": "medium",
  "assignedToId": "ObjectId or null"
}
```

**Response 200:** `TicketResponse`  
**Response 400 / 404**

---

## PATCH `/tickets/:id/status`

**Purpose:** State machine status change

**Request**
```json
{ "status": "in_progress" }
```

**Response 200:** `TicketResponse`  
**Response 400:** `{ "error": "Cannot transition from open to closed" }`

---

## GET `/tickets/:id/allowed-transitions`

**Purpose:** Valid next statuses for UI buttons

**Response 200**
```json
{
  "currentStatus": "open",
  "allowedTransitions": ["in_progress", "cancelled"]
}
```

---

## POST `/tickets/:ticketId/comments`

**Purpose:** Add comment to ticket

**Request**
```json
{
  "message": "Investigating root cause",
  "createdById": "ObjectId"
}
```

**Response 201:** `CommentResponse`  
**Response 400 / 404**

---

## GET `/users`

**Purpose:** Seeded users for dropdowns

**Response 200:** `UserSummary[]`

---

## Error format

```json
{
  "error": "Human-readable message",
  "details": [{ "field": "title", "message": "Title is required" }]
}
```
