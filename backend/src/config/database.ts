import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/support_tickets';

  await mongoose.connect(uri);

  const { host, name } = mongoose.connection;
  console.log(`MongoDB connected: ${host} / database: ${name}`);
}

export async function syncIndexes(): Promise<void> {
  const { User, Ticket, Comment } = await import('../models');

  await Promise.all([
    User.syncIndexes(),
    Ticket.syncIndexes(),
    Comment.syncIndexes(),
  ]);

  console.log('Database indexes synced');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
