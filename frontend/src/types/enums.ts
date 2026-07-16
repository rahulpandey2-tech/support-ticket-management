export const USER_ROLES = ['admin', 'agent', 'user'] as const;
export type Role = (typeof USER_ROLES)[number];

export const TICKET_PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = [
  'open',
  'in_progress',
  'resolved',
  'closed',
  'cancelled',
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
