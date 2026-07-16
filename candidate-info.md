# Candidate Information

| Field | Value |
|-------|--------|
| **Name** | Rahul Pandey |
| **Role** | Software Engineer |
| **Primary Technology Stack** | React, Node.js, TypeScript, MongoDB |
| **Primary AI Tool Used** | Cursor (Agent mode) |
| **Project Option Selected** | Support Ticket Management System (Backend-heavy Core) |
| **Assessment Start Date** | 2026-07-01 |
| **Submission Date** | 2026-07-16 |

---

## Project Summary

A full-stack **Support Ticket Management System** for internal users to create, search, filter, comment on, and progress tickets through a **backend-enforced status state machine**. Built with React + Vite (frontend), Express + TypeScript (backend), and MongoDB Atlas + Mongoose (persistence).

Core scope includes ticket CRUD, comments, keyword search, status filter, UI error states, integration tests for the state machine, and full lifecycle documentation (requirements, spec, prompt history, reflection).

---

## Tools Used

| Tool | Purpose |
|------|---------|
| **Cursor** | Primary AI assistant — planning, implementation, testing, debugging, docs |
| **Node.js 20+** | Backend runtime |
| **MongoDB Atlas** | Cloud database (local MongoDB also supported) |
| **Jest + Supertest** | API integration tests |
| **MongoDB Memory Server** | Isolated in-memory DB for tests |
| **Git / GitHub** | Version control — `rahulpandey2-tech/support-ticket-management` |

---

## Setup Summary

```bash
# Backend
cd backend
npm install
copy .env.example .env   # set MONGODB_URI
npm run verify:db
npm run seed
npm run dev              # http://localhost:3001

# Frontend
cd frontend
npm install
copy .env.example .env
npm run dev              # http://localhost:5173

# Tests
cd backend
npm test                 # 16 integration tests
```

See [README.md](./README.md) for full instructions.
