import type { TicketStatus } from '../types';

/** All 5 allowed transitions (Core requirement) */
export const VALID_TRANSITIONS: ReadonlyArray<{
  from: TicketStatus;
  to: TicketStatus;
}> = [
  { from: 'open', to: 'in_progress' },
  { from: 'in_progress', to: 'resolved' },
  { from: 'resolved', to: 'closed' },
  { from: 'open', to: 'cancelled' },
  { from: 'in_progress', to: 'cancelled' },
];

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
  return [...ALLOWED_TRANSITIONS[from]];
}

export function getInvalidTransitionMessage(
  from: TicketStatus,
  to: TicketStatus
): string {
  return `Cannot transition from ${from} to ${to}`;
}
