# AI Prompts — Design

> Architecture and data model decisions clarified step-by-step with Cursor.

---

**Prompt:**
> I'm using MongoDB + Mongoose. Help me define indexes for Ticket — I need filter by status, sort by updatedAt, and text search on title and description. What indexes go on the schema?

**Outcome:** Compound text index + status + updatedAt indexes.

---

**Prompt:**
> Should status change go through the same PATCH /tickets/:id as title updates? My requirement is status must follow a strict state machine.

**Outcome:** Separate `PATCH /tickets/:id/status` endpoint — confirmed in design.

---

**Prompt:**
> For the frontend, should I show all 5 status options on detail page or only valid next ones? Backend will reject invalid anyway.

**Outcome:** Only allowed transitions from API — better UX and matches AC-13.

---

**Prompt:**
> Draw me the layer structure for backend: where does Zod validation sit vs controller vs service?

**Outcome:** Route → validate → controller → service → model. Documented in design-notes.md.
