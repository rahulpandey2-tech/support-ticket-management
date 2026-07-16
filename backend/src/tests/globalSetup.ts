import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  // eslint-disable-next-line no-var
  var __MONGOINSTANCE: MongoMemoryServer | undefined;
}

export default async function globalSetup(): Promise<void> {
  const instance = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 120000,
    },
  });

  global.__MONGOINSTANCE = instance;
  process.env.MONGODB_URI = instance.getUri();
  process.env.CORS_ORIGIN = 'http://localhost:5173';
}
