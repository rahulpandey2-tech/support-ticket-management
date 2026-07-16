import { Comment, Ticket, type ITicket } from '../models';
import { badRequest, notFound } from '../errors/AppError';
import type { TicketStatus } from '../types';
import {
  canTransition,
  getAllowedTransitions,
  getInvalidTransitionMessage,
} from './statusMachine';
import { ensureUserExists } from './userService';
import { toTicketResponse } from '../utils/mappers';

interface ListTicketsOptions {
  status?: TicketStatus;
  q?: string;
}

interface CreateTicketInput {
  title: string;
  description: string;
  priority: ITicket['priority'];
  assignedToId?: string | null;
  createdById: string;
}

interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: ITicket['priority'];
  assignedToId?: string | null;
}

function buildListFilter(options: ListTicketsOptions): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (options.status) {
    filter.status = options.status;
  }

  if (options.q) {
    filter.$text = { $search: options.q };
  }

  return filter;
}

const ticketPopulate = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' },
];

export async function listTickets(options: ListTicketsOptions) {
  const tickets = await Ticket.find(buildListFilter(options))
    .populate(ticketPopulate)
    .sort({ updatedAt: -1 });

  return tickets.map((ticket) => toTicketResponse(ticket));
}

export async function getTicketById(id: string) {
  const ticket = await Ticket.findById(id).populate(ticketPopulate);

  if (!ticket) {
    throw notFound('Ticket not found');
  }

  const comments = await Comment.find({ ticketId: id })
    .populate({ path: 'createdBy', select: 'name email role' })
    .sort({ createdAt: -1 });

  return toTicketResponse(ticket, comments);
}

export async function createTicket(input: CreateTicketInput) {
  await ensureUserExists(input.createdById);

  if (input.assignedToId) {
    await ensureUserExists(input.assignedToId);
  }

  const ticket = await Ticket.create({
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: 'open',
    assignedTo: input.assignedToId ?? null,
    createdBy: input.createdById,
  });

  await ticket.populate(ticketPopulate);
  return toTicketResponse(ticket);
}

export async function updateTicket(id: string, input: UpdateTicketInput) {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw notFound('Ticket not found');
  }

  if (input.title !== undefined) ticket.title = input.title;
  if (input.description !== undefined) ticket.description = input.description;
  if (input.priority !== undefined) ticket.priority = input.priority;

  if (input.assignedToId !== undefined) {
    if (input.assignedToId) {
      await ensureUserExists(input.assignedToId);
    }
    ticket.set('assignedTo', input.assignedToId);
  }

  await ticket.save();
  await ticket.populate(ticketPopulate);
  return toTicketResponse(ticket);
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw notFound('Ticket not found');
  }

  if (!canTransition(ticket.status, status)) {
    throw badRequest(getInvalidTransitionMessage(ticket.status, status));
  }

  ticket.status = status;
  await ticket.save();
  await ticket.populate(ticketPopulate);
  return toTicketResponse(ticket);
}

export async function getAllowedTransitionsForTicket(id: string) {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw notFound('Ticket not found');
  }

  return {
    currentStatus: ticket.status,
    allowedTransitions: getAllowedTransitions(ticket.status),
  };
}

export async function ensureTicketExists(id: string): Promise<void> {
  const exists = await Ticket.exists({ _id: id });
  if (!exists) {
    throw notFound('Ticket not found');
  }
}
