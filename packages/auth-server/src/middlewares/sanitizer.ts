import mongoSanitize from 'express-mongo-sanitize';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

const sanitizer = (req: FastifyRequest, res: FastifyReply, done: HookHandlerDoneFunction) => {
  mongoSanitize.sanitize(req.body as Record<string, unknown> | unknown[]);
  mongoSanitize.sanitize(req.params as Record<string, unknown> | unknown[]);
  done();
};

export default sanitizer;
