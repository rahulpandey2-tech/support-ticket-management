import mongoose from 'mongoose';

export default async function globalTeardown(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (global.__MONGOINSTANCE) {
    await global.__MONGOINSTANCE.stop();
  }
}
