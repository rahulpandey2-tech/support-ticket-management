import type { TicketStatus } from '../types';

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};

export function canTransition(
  from: TicketStatus,
  to: TicketStatus
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(from: TicketStatus): TicketStatus[] {
  return ALLOWED_TRANSITIONS[from];
}
