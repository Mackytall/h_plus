import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';
import { User, UserModel } from '../models/User';
import { createAdmin } from '../utils/accounts';

export interface Models {
  User: UserModel;
}

export interface Db {
  models: Models;
}

const ConnectDB: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  try {
    mongoose.connection.on('connected', () => {
      fastify.log.info({ actor: 'MongoDB' }, 'connected');
    });
    mongoose.connection.on('disconnected', () => {
      fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
    });
    await mongoose.connect(fastify.config.MONGO_URI);
    createAdmin();
    const models: Models = { User };
    fastify.decorate('db', { models });
  } catch (error) {
    fastify.log.error('DB error: ', error);
  }
};

export default fp(ConnectDB);
