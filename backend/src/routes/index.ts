import { Router } from 'express';
import ticketsRouter from './tickets';
import usersRouter from './users';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/tickets', ticketsRouter);
apiRouter.use('/users', usersRouter);

export default apiRouter;
