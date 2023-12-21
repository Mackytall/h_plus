import 'dotenv/config';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import Ajv from 'ajv';

export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

const ConfigSchema = Type.Strict(
  Type.Object({
    NODE_ENV: Type.Enum(NodeEnv),
    LOG_LEVEL: Type.String(),
    API_HOST: Type.String(),
    API_PORT: Type.String(),
    MONGO_URI: Type.String(),
    ALLOW_ORIGIN: Type.String(),
    JWT_TOKEN: Type.String(),
    ADMIN_PWD: Type.String(),
    PROD_URL: Type.String(),
    BUCKET_ENDPOINT: Type.String(),
    BUCKET_ID: Type.String(),
    BUCKET_ACCESS: Type.String(),
    BUCKET_SECRET: Type.String(),
  })
);

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error('.env file validation failed - ' + JSON.stringify(validate.errors, null, 2));
  }
  server.decorate('config', process.env);
};

export default fp(configPlugin);
