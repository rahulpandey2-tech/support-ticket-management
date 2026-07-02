import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, syncIndexes } from './config/database';
import './models/User';
import './models/Ticket';
import './models/Comment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Support Ticket Management System API' });
});

async function start() {
  await connectDatabase();
  await syncIndexes();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
