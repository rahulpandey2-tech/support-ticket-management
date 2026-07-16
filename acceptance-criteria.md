# Acceptance Criteria — Support Ticket Management System (Core)

> Testable criteria for Core completion. Use with integration tests and manual E2E checks.  
> See also [`requirements-analysis.md`](./requirements-analysis.md).

**Legend:** `[ ]` not verified · `[x]` verified

---

## AC-1: Create ticket via UI

**Given** the user is on the Create Ticket page  
**And** valid title, description, priority, and assignee are entered  
**When** the user submits the form  
**Then** a new ticket is created with status `open`  
**And** the user is redirected to the ticket detail page  
**And** the ticket appears in the database

---

## AC-2: List tickets from database

**Given** tickets exist in the database (seeded or created)  
**When** the user opens the Ticket List page  
**Then** all tickets are displayed with title, status, priority, assignee, and dates  
**And** data is loaded from the API (not hardcoded)

---

## AC-3: Ticket detail view

**Given** a ticket exists with id `:id`  
**When** the user navigates to `/tickets/:id`  
**Then** full ticket information is displayed  
**And** all comments for that ticket are shown with author and timestamp

**Given** a ticket id does not exist  
**When** the user navigates to `/tickets/:id`  
**Then** a meaningful "not found" message is shown

---

## AC-4: Update ticket fields and reassign

**Given** the user is on the ticket detail page  
**When** the user edits title, description, priority, or assignee and saves  
**Then** the changes are persisted  
**And** the updated values are shown after refresh  
**And** `status` is unchanged by this action

---

## AC-5: Add comments

**Given** the user is on the ticket detail page  
**When** the user submits a non-empty comment  
**Then** the comment is saved to the database  
**And** it appears in the comments list with author name and `createdAt`

**Given** the user submits an empty comment  
**When** the form is submitted  
**Then** the backend returns 400  
**And** the UI shows an error message

---

## AC-6: Keyword search

**Given** tickets exist with known text in title or description  
**When** the user enters a keyword in the search field  
**Then** only tickets matching the keyword in title or description are shown

**Given** search is combined with a status filter  
**When** both are applied  
**Then** results match both criteria

---

## AC-7: Filter by status

**Given** tickets exist in multiple statuses  
**When** the user selects a status filter (e.g. `open`)  
**Then** only tickets with that status are shown

**Given** the user selects "All"  
**When** the list loads  
**Then** tickets of all statuses are shown (subject to search if active)

---

## AC-8: Data persistence after restart

**Given** tickets and comments have been created  
**When** the backend server and database are restarted  
**Then** all previously saved data is still available via the API and UI

---

## AC-9: Backend validation

**Given** a create ticket request with empty title  
**When** POST `/api/tickets` is called  
**Then** response is 400 with an error message

**Given** a create ticket request with empty description  
**When** POST `/api/tickets` is called  
**Then** response is 400 with an error message

**Given** an update request for a non-existent ticket id  
**When** PATCH `/api/tickets/:id` is called  
**Then** response is 404

---

## AC-10: No secrets in repository

**Given** the repository is inspected  
**Then** no `.env` file with real secrets is committed  
**And** `.env.example` is provided with placeholders only

---

## AC-11: State machine — valid transitions (integration tests)

### T1: open → in_progress

**Given** a ticket exists with status `open`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "in_progress" }`  
**Then** response is 200  
**And** ticket status is `in_progress`

### T2: in_progress → resolved

**Given** a ticket exists with status `in_progress`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "resolved" }`  
**Then** response is 200  
**And** ticket status is `resolved`

### T3: resolved → closed

**Given** a ticket exists with status `resolved`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "closed" }`  
**Then** response is 200  
**And** ticket status is `closed`

### T4: open → cancelled

**Given** a ticket exists with status `open`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "cancelled" }`  
**Then** response is 200  
**And** ticket status is `cancelled`

### T5: in_progress → cancelled

**Given** a ticket exists with status `in_progress`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "cancelled" }`  
**Then** response is 200  
**And** ticket status is `cancelled`

---

## AC-12: State machine — invalid transitions (integration tests)

### Invalid: open → closed

**Given** a ticket exists with status `open`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "closed" }`  
**Then** response is 400 (or 409)  
**And** body contains a clear error message  
**And** ticket status remains `open`

### Invalid: open → resolved

**Given** a ticket exists with status `open`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "resolved" }`  
**Then** response is 400 (or 409)  
**And** ticket status remains `open`

### Invalid: resolved → in_progress

**Given** a ticket exists with status `resolved`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "in_progress" }`  
**Then** response is 400 (or 409)  
**And** ticket status remains `resolved`

### Invalid: closed → open

**Given** a ticket exists with status `closed`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "open" }`  
**Then** response is 400 (or 409)  
**And** ticket status remains `closed`

### Invalid: cancelled → in_progress

**Given** a ticket exists with status `cancelled`  
**When** PATCH `/api/tickets/:id/status` with `{ "status": "in_progress" }`  
**Then** response is 400 (or 409)  
**And** ticket status remains `cancelled`

---

## AC-13: State machine — UI behaviour

**Given** a ticket is in status `open`  
**When** the user views the detail page  
**Then** only valid next statuses (`in_progress`, `cancelled`) are offered

**Given** the user attempts an invalid status change (via API or UI)  
**When** the backend rejects the transition  
**Then** the UI displays the backend error message  
**And** the displayed status does not change incorrectly

---

## AC-14: Integration test suite passes

**Given** the backend test suite is run with `npm test`  
**When** all Core tests execute  
**Then** state machine valid and invalid transition tests pass  
**And** no tests are skipped for the mandatory tier

---

## Core checklist (summary)

- [x] AC-1  Create ticket via UI
- [x] AC-2  List tickets from database
- [x] AC-3  Ticket detail view
- [x] AC-4  Update fields and reassign
- [x] AC-5  Add comments
- [x] AC-6  Keyword search
- [x] AC-7  Filter by status
- [x] AC-8  Data persistence after restart
- [x] AC-9  Backend validation
- [x] AC-10 No secrets in repo
- [x] AC-11 Valid status transitions (tests)
- [x] AC-12 Invalid status transitions (tests)
- [x] AC-13 State machine UI behaviour
- [x] AC-14 Integration test suite passes

---

*Document: Step 0.6 — Acceptance Criteria. Check off items as verified during Phase 7–8.*
