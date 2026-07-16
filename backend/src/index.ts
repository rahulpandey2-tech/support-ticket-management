import dotenv from 'dotenv';
import { connectDatabase, syncIndexes } from './config/database';
import { app } from './app';

dotenv.config();

const PORT = process.env.PORT || 3001;

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
