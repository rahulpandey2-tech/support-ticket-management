import { Router } from 'express';
import commentsRouter from './comments';

const router = Router();

// Ticket endpoints — implemented in Phase 4 (Steps 4.1–4.9)
// GET    /
// GET    /:id
// POST   /
// PATCH  /:id
// PATCH  /:id/status
// GET    /:id/allowed-transitions

router.use('/:ticketId/comments', commentsRouter);

export default router;
