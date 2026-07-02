import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody, validateParams } from '../middleware/validate';
import { createCommentSchema, ticketCommentParamsSchema } from '../validators';

const router = Router({ mergeParams: true });

router.post(
  '/',
  validateParams(ticketCommentParamsSchema),
  validateBody(createCommentSchema),
  asyncHandler(commentController.createComment)
);

export default router;
