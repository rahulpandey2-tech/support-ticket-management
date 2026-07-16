# Data Model — Support Ticket Management System

> Mongoose schemas in `backend/src/models/`. Seed: `backend/src/scripts/seed.ts`

---

## User (seeded only)

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | PK |
| `name` | string | required, trimmed |
| `email` | string | required, unique, lowercase |
| `role` | enum | `admin` \| `agent` \| `user` |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

**Indexes:** `email` (unique)

---

## Ticket

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | PK |
| `title` | string | required, max 200 |
| `description` | string | required |
| `priority` | enum | `low` \| `medium` \| `high` |
| `status` | enum | default `open` |
| `assignedTo` | ObjectId → User | optional, ref |
| `createdBy` | ObjectId → User | required, ref |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

**Indexes:** `status`, `updatedAt`, text(`title`, `description`)

**Status values:** `open`, `in_progress`, `resolved`, `closed`, `cancelled`

---

## Comment

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | PK |
| `ticketId` | ObjectId → Ticket | required, ref |
| `message` | string | required, trimmed |
| `createdBy` | ObjectId → User | required, ref |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

**Indexes:** `ticketId` + `createdAt`

---

## Relationships

```
User 1──* Ticket (createdBy)
User 1──* Ticket (assignedTo)
Ticket 1──* Comment
User 1──* Comment (createdBy)
```

---

## Seed data (Core)

| Collection | Count |
|------------|-------|
| users | 5 |
| tickets | 10 |
| comments | 8 |

Emails: `@example.com` only.
