import { Request, Response } from 'express';
import * as ticketService from '../services/ticketService';
import type { TicketStatus } from '../types';
import { z } from 'zod';
import {
  createTicketSchema,
  ticketIdParamsSchema,
  updateTicketSchema,
  updateTicketStatusSchema,
} from '../validators';

export async function listTickets(req: Request, res: Response) {
  const { status, q } = (req.validated?.query ?? {}) as {
    status?: TicketStatus;
    q?: string;
  };

  const tickets = await ticketService.listTickets({ status, q });
  res.json(tickets);
}

export async function getTicketById(req: Request, res: Response) {
  const { id } = req.validated?.params as z.infer<typeof ticketIdParamsSchema>;
  const ticket = await ticketService.getTicketById(id);
  res.json(ticket);
}

export async function createTicket(req: Request, res: Response) {
  const body = req.validated?.body as z.infer<typeof createTicketSchema>;
  const ticket = await ticketService.createTicket(body);
  res.status(201).json(ticket);
}

export async function updateTicket(req: Request, res: Response) {
  const { id } = req.validated?.params as z.infer<typeof ticketIdParamsSchema>;
  const body = req.validated?.body as z.infer<typeof updateTicketSchema>;
  const ticket = await ticketService.updateTicket(id, body);
  res.json(ticket);
}

export async function updateTicketStatus(req: Request, res: Response) {
  const { id } = req.validated?.params as z.infer<typeof ticketIdParamsSchema>;
  const { status } = req.validated?.body as z.infer<
    typeof updateTicketStatusSchema
  >;
  const ticket = await ticketService.updateTicketStatus(id, status);
  res.json(ticket);
}

export async function getAllowedTransitions(req: Request, res: Response) {
  const { id } = req.validated?.params as z.infer<typeof ticketIdParamsSchema>;
  const result = await ticketService.getAllowedTransitionsForTicket(id);
  res.json(result);
}
