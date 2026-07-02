import type { IUser } from '../models/User';
import type {
  CommentResponse,
  TicketResponse,
  UserSummary,
} from '../types';
import type { IComment } from '../models/Comment';
import type { ITicket } from '../models/Ticket';

function isPopulatedUser(
  value: unknown
): value is IUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'name' in value
  );
}

export function toUserSummary(user: unknown): UserSummary | null {
  if (!isPopulatedUser(user)) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function toCommentResponse(comment: IComment): CommentResponse {
  const createdBy = toUserSummary(comment.createdBy);

  return {
    id: comment._id.toString(),
    message: comment.message,
    createdAt: comment.createdAt.toISOString(),
    createdBy: createdBy ?? {
      id: comment.createdBy.toString(),
      name: 'Unknown',
      email: 'unknown@example.com',
      role: 'user',
    },
  };
}

export function toTicketResponse(
  ticket: ITicket,
  comments?: IComment[]
): TicketResponse {
  const response: TicketResponse = {
    id: ticket._id.toString(),
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assignedTo: toUserSummary(ticket.assignedTo),
    createdBy: toUserSummary(ticket.createdBy) ?? {
      id: ticket.createdBy.toString(),
      name: 'Unknown',
      email: 'unknown@example.com',
      role: 'user',
    },
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };

  if (comments) {
    response.comments = comments.map(toCommentResponse);
  }

  return response;
}
