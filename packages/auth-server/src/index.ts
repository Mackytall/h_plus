import fastify from 'fastify';
import config, { Config } from './plugins/config';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import db, { Db } from './plugins/db';
import UserRoute from './routes/users';
import multer from 'fastify-multer';
import { UserRole } from './models/User';
const PREFIX = '/api';

declare module 'fastify' {
  export interface FastifyInstance {
    db: Db;
    role: (options: string[]) => void;
    config: Config;
  }
  export interface FastifyRequest {
    userId?: string;
    role?: UserRole;
  }
}

const server = fastify({
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      coerceTypes: true,
      useDefaults: true,
    },
  },
  logger: {
    level: process.env.LOG_LEVEL,
    name: 'Auth server',
  },
});

await server.register(config);
await server.register(db);
await server.register(helmet);
await server.register(multer.contentParser);
await server.register(cors, { origin: server.config.ALLOW_ORIGIN });
await server.register(UserRoute, { prefix: `${PREFIX}/users` });
await server.ready();

export default server;

if (process.env.NODE_ENV !== 'test') {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });
  const port = +server.config.API_PORT;
  const host = server.config.API_HOST;
  await server.listen({ host, port });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      })
    );
  }
}
