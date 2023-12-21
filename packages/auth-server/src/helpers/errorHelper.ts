import { FastifyReply, FastifyRequest } from 'fastify';

type ObjError = {
  error: string;
};

type ObjMessage = {
  message: string;
};

export const errorHandler = (error: unknown): string => {
  const defaultMessage = 'Un problème est survenu, veuillez réessayer';
  if (typeof error === 'object' && error) {
    if ((error as ObjError).error) {
      return (error as ObjError).error || defaultMessage;
    } else if ((error as ObjMessage).message) {
      return (error as ObjMessage).message || defaultMessage;
    }
  } else if (typeof error === 'string') {
    return error || defaultMessage;
  } else {
    return defaultMessage;
  }
  return defaultMessage;
};

export const errorResponse = (req: FastifyRequest, res: FastifyReply, error: unknown) => {
  req.log.error(error);
  return res.code(500).send({ error: errorHandler(error) });
};
