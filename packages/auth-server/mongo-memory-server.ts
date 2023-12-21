import { setup as setupDb, teardown as teardownDb } from 'vitest-mongodb';

export const setup = async () => {
  await setupDb();
  process.env.MONGO_URI = global.__MONGO_URI__;
};

export const teardown = async () => {
  await teardownDb();
};
