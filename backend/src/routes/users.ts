import { Router } from 'express';
import * as userController from '../controllers/userController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(userController.listUsers));

export default router;
