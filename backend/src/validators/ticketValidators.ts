import { TICKET_PRIORITIES, TICKET_STATUSES } from '../types';
import { z } from 'zod';
import { objectIdSchema } from './common';

export const ticketIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const ticketCommentParamsSchema = z.object({
  ticketId: objectIdSchema,
});

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required'),
  priority: z.enum(TICKET_PRIORITIES),
  assignedToId: objectIdSchema.optional().nullable(),
  createdById: objectIdSchema,
});

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).optional(),
    priority: z.enum(TICKET_PRIORITIES).optional(),
    assignedToId: objectIdSchema.optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const updateTicketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
});

export const createCommentSchema = z.object({
  message: z.string().trim().min(1, 'Message is required'),
  createdById: objectIdSchema,
});

export const listTicketsQuerySchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  q: z.string().trim().optional(),
});
