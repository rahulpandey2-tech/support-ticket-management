import { Comment } from '../models';
import { ensureTicketExists } from './ticketService';
import { ensureUserExists } from './userService';
import { toCommentResponse } from '../utils/mappers';

interface CreateCommentInput {
  message: string;
  createdById: string;
}

export async function createComment(
  ticketId: string,
  input: CreateCommentInput
) {
  await ensureTicketExists(ticketId);
  await ensureUserExists(input.createdById);

  const comment = await Comment.create({
    ticketId,
    message: input.message,
    createdBy: input.createdById,
  });

  await comment.populate({ path: 'createdBy', select: 'name email role' });
  return toCommentResponse(comment);
}
