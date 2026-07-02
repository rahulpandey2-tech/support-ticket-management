import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { z } from 'zod';
import {
  createCommentSchema,
  ticketCommentParamsSchema,
} from '../validators';

export async function createComment(req: Request, res: Response) {
  const { ticketId } = req.validated?.params as z.infer<
    typeof ticketCommentParamsSchema
  >;
  const body = req.validated?.body as z.infer<typeof createCommentSchema>;
  const comment = await commentService.createComment(ticketId, body);
  res.status(201).json(comment);
}
