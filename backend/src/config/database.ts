import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/support_tickets';

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
