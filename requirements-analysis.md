# Requirements Analysis — Support Ticket Management System

## 1. Problem Statement

We need a small internal application for managing support tickets. Internal users should be able to create tickets, view and update them, add comments, search and filter tickets, and move tickets through a fixed lifecycle. The system must persist data in a database so nothing is lost when the application restarts.

This document captures **Core** requirements only. Stretch features (auth, user management UI, pagination, etc.) are listed separately as out of scope.

---

## 2. Users & Actors

For **Core**, there is no login screen. Users exist in the database as **seeded records** only. The UI will reference these users when creating tickets (creator), assigning tickets (assignee), and posting comments.

| Actor | Description |
|-------|-------------|
| Internal user | Any seeded user who creates or works on tickets via the UI |
| System (backend) | Enforces validation rules and the ticket status state machine |

---

## 3. Entities

### 3.1 User (seeded — no management UI in Core)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | integer / UUID | Yes | Primary key |
| name | string | Yes | Display name |
| email | string | Yes | Unique; use example addresses in seed data |
| role | enum | Yes | e.g. `admin`, `agent`, `user` |

**Rules:**
- Users are created only via seed script, not through the application UI.
- User list may be exposed via API for assignee/creator dropdowns.

---

### 3.2 Ticket

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | integer / UUID | Yes | Primary key |
| title | string | Yes | Short summary of the issue |
| description | string | Yes | Full details |
| priority | enum | Yes | `low`, `medium`, `high` |
| status | enum | Yes | See state machine (Section 5) |
| assignedTo | FK → User | No | User responsible for the ticket |
| createdBy | FK → User | Yes | User who opened the ticket |
| createdAt | datetime | Yes | Set on create |
| updatedAt | datetime | Yes | Updated on any ticket change |

**Rules:**
- New tickets start with status `open`.
- `title` and `description` cannot be empty.
- `priority` and `status` must be valid enum values.
- Status cannot be changed by a generic “update ticket” operation — it must go through the dedicated status transition logic.

---

### 3.3 Comment

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | integer / UUID | Yes | Primary key |
| ticketId | FK → Ticket | Yes | Parent ticket |
| message | string | Yes | Comment body; must not be empty |
| createdBy | FK → User | Yes | Author of the comment |
| createdAt | datetime | Yes | Set on create |

**Rules:**
- Comments belong to exactly one ticket.
- Comments are append-only in Core (no edit/delete required).
- Adding a comment to a non-existent ticket must return an error.

---

## 4. Core Features

| # | Feature | Description |
|---|---------|-------------|
| F1 | Create ticket | User submits title, description, priority, assignee, and creator (from seeded users). Ticket is saved with status `open`. |
| F2 | List tickets | Show all tickets from the database with key fields (title, status, priority, assignee, dates). |
| F3 | View ticket detail | Show full ticket information and all comments for one ticket. |
| F4 | Update ticket fields | Edit title, description, priority, and assignee. Does **not** change status directly. |
| F5 | Change ticket status | Move ticket to a new status only if the transition is allowed by the state machine. |
| F6 | Add comment | Post a text comment on a ticket; show author and timestamp. |
| F7 | Keyword search | Search tickets by keyword in title and/or description. |
| F8 | Filter by status | Show only tickets matching a selected status. |
| F9 | Data persistence | All tickets, users, and comments survive application and database restart. |
| F10 | Input validation | Backend rejects invalid or incomplete data; frontend shows meaningful error messages. |

---

## 5. Status State Machine (5 Allowed Transitions)

This is the most important business rule in Core. The **backend must enforce** it; the frontend should only offer valid next statuses and display errors for invalid attempts.

| # | From | To | Meaning |
|---|------|-----|---------|
| T1 | `open` | `in_progress` | Work has started on the ticket |
| T2 | `in_progress` | `resolved` | Issue is fixed, pending confirmation |
| T3 | `resolved` | `closed` | Ticket is fully closed |
| T4 | `open` | `cancelled` | Ticket cancelled before work started |
| T5 | `in_progress` | `cancelled` | Ticket cancelled while in progress |

### Terminal statuses

- **`closed`** — no further transitions allowed.
- **`cancelled`** — no further transitions allowed.

### Examples of invalid transitions (must be rejected)

| From | To | Why invalid |
|------|-----|-------------|
| `open` | `closed` | Must go through `in_progress` → `resolved` first |
| `open` | `resolved` | Cannot skip `in_progress` |
| `resolved` | `in_progress` | Cannot reopen from resolved |
| `closed` | any | Terminal state |
| `cancelled` | any | Terminal state |

**API behaviour:** invalid transition → HTTP 400 (or 409) with a clear error message.  
**UI behaviour:** show the error to the user; do not update the displayed status.

---

## 6. Search & Filter Requirements

### Keyword search (F7)
- Search across ticket `title` and `description`.
- Case-insensitive matching is acceptable for Core.
- Empty search should return all tickets (or behave consistently with list view).

### Status filter (F8)
- Filter tickets by one status value at a time.
- Should work together with keyword search (both applied at once).

---

## 7. Validation & Error Handling

| Area | Requirement |
|------|-------------|
| Create ticket | Reject missing/empty `title` or `description` |
| Create ticket | Reject invalid `priority` or unknown user IDs |
| Update ticket | Reject invalid field values; return 404 if ticket not found |
| Status change | Reject invalid transitions with descriptive message |
| Add comment | Reject empty `message`; return 404 if ticket not found |
| Frontend | Show API error messages; handle loading and not-found states |

---

## 8. Testing Requirements (Core)

| Requirement | Detail |
|-------------|--------|
| Mandatory | Integration tests for the status state machine |
| Valid transitions | All 5 allowed transitions must succeed in tests |
| Invalid transitions | Representative invalid transitions must be rejected |
| Optional for Core | Unit tests, edge-case tests (Stretch evidence) |

---

## 9. Out of Scope (Core)

The following are **not required** for Core completion. They may be added later as Stretch.

| Item | Reason |
|------|--------|
| User CRUD UI | Users are seeded only per exercise brief |
| Role management UI | Stretch feature |
| Authentication / login | Optional for Core; Stretch if implemented |
| Protected routes / API authorization | Depends on auth (Stretch) |
| Filter by priority or assignee | Stretch |
| Sorting and pagination | Stretch |
| Third entity beyond User/Ticket/Comment | Stretch |
| Swagger / OpenAPI docs | Stretch |
| Docker / CI pipeline | Stretch |

---

## 10. Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| Database | Required — PostgreSQL, MySQL, MongoDB, SQLite, etc. |
| Migrations / schema | Version-controlled setup scripts |
| Seed data | Sample users, tickets, and comments for local dev |
| README | Clear steps to install, configure, migrate, seed, and run |
| Secrets | No real credentials committed; provide `.env.example` |
| AI workflow artifacts | Documented separately per exercise (Part A & tool-specific folders) |

---

## 11. Core Acceptance Criteria Summary

- [ ] User can create a ticket via the UI
- [ ] User can view all tickets from the database
- [ ] User can open a ticket detail view
- [ ] User can update ticket fields and reassign
- [ ] User can add comments
- [ ] Status changes only through valid transitions; invalid ones rejected
- [ ] Keyword search and status filter work
- [ ] Data remains available after restart
- [ ] Backend validation prevents invalid records
- [ ] No secrets committed to the repo
- [ ] State-machine integration tests pass

---

## 12. Assumptions & Decisions

1. **No authentication in Core** — the UI picks a seeded user as creator; assignee comes from a dropdown of seeded users.
2. **Status changes are isolated** — a separate API action from general field updates, so the state machine cannot be bypassed.
3. **Comments are read in ticket detail** — no separate comments page needed.
4. **Single application instance** — no multi-tenant or external integrations required.

---

*Document: Step 0.2 — Requirements Analysis. Aligned with JS AI Capability Exercise — Support Ticket Management System (Core).*
