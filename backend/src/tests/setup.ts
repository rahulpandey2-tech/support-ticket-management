import mongoose from 'mongoose';
import { syncIndexes } from '../config/database';

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set — is globalSetup configured?');
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    await syncIndexes();
  }
});

beforeEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});
