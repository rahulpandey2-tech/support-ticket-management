import { Router } from 'express';
import * as ticketController from '../controllers/ticketController';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamsSchema,
  updateTicketSchema,
  updateTicketStatusSchema,
} from '../validators';
import commentsRouter from './comments';

const router = Router();

router.get(
  '/',
  validateQuery(listTicketsQuerySchema),
  asyncHandler(ticketController.listTickets)
);

router.post(
  '/',
  validateBody(createTicketSchema),
  asyncHandler(ticketController.createTicket)
);

router.get(
  '/:id/allowed-transitions',
  validateParams(ticketIdParamsSchema),
  asyncHandler(ticketController.getAllowedTransitions)
);

router.patch(
  '/:id/status',
  validateParams(ticketIdParamsSchema),
  validateBody(updateTicketStatusSchema),
  asyncHandler(ticketController.updateTicketStatus)
);

router.get(
  '/:id',
  validateParams(ticketIdParamsSchema),
  asyncHandler(ticketController.getTicketById)
);

router.patch(
  '/:id',
  validateParams(ticketIdParamsSchema),
  validateBody(updateTicketSchema),
  asyncHandler(ticketController.updateTicket)
);

router.use('/:ticketId/comments', commentsRouter);

export default router;
