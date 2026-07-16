import type { Priority, Role, TicketStatus } from './enums';

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
  details?: ErrorDetail[];
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface CommentResponse {
  id: string;
  message: string;
  createdAt: string;
  createdBy: UserSummary;
}

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: UserSummary | null;
  createdBy: UserSummary;
  createdAt: string;
  updatedAt: string;
  comments?: CommentResponse[];
}

export interface AllowedTransitionsResponse {
  currentStatus: TicketStatus;
  allowedTransitions: TicketStatus[];
}

export interface HealthResponse {
  status: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: Priority;
  assignedToId?: string | null;
  createdById: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: Priority;
  assignedToId?: string | null;
}

export interface CreateCommentInput {
  message: string;
  createdById: string;
}
