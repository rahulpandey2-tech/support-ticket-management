import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase, syncIndexes } from '../config/database';
import '../models/User';
import '../models/Ticket';
import '../models/Comment';
import { User, Ticket, Comment } from '../models';

dotenv.config();

async function verifyDatabase(): Promise<void> {
  console.log('Verifying MongoDB connection and indexes...\n');

  await connectDatabase();
  await syncIndexes();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }

  const collections = await db.listCollections().toArray();

  console.log('\nRegistered models: User, Ticket, Comment');
  console.log(
    'Collections in database:',
    collections.length > 0
      ? collections.map((c) => c.name).join(', ')
      : '(none yet — created on first write)'
  );

  const models = [
    { name: 'User', model: User },
    { name: 'Ticket', model: Ticket },
    { name: 'Comment', model: Comment },
  ];

  console.log('\nIndexes:');
  for (const { name, model } of models) {
    const indexes = await model.collection.indexes();
    console.log(
      `  ${name}:`,
      indexes.map((index) => index.name).join(', ')
    );
  }

  await disconnectDatabase();
  console.log('\nVerification complete.');
}

verifyDatabase().catch((error) => {
  console.error('Database verification failed:', error.message);
  process.exit(1);
});
