import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { UserRole } from '../models/User';
import auth from '../middlewares/auth';
import authorize, { CustomAuthorizeRequest } from '../middlewares/authorize';
import multer from '../middlewares/multer-config';
import sanitizer from '../middlewares/sanitizer';
import {
  GetUserReq,
  LikeOrDislikeEventReq,
  LoginReq,
  SignupReq,
  UpdateUserReq,
  VerifyTokenReq,
} from '../interfaces/users';
import usersController from '../controllers/users';

const UserRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  const PREFIX = options.prefix;

  server.get(
    `${PREFIX}`,
    {
      preHandler: [
        auth,
        (req, res, done) => authorize(req as CustomAuthorizeRequest, res, done, [UserRole.admin]),
      ],
    },
    usersController.getUsers
  );

  server.get<GetUserReq>(`${PREFIX}/:id`, { preHandler: auth }, usersController.getUser);

  server.post<LoginReq>(`${PREFIX}/login`, { preHandler: sanitizer }, usersController.login);

  server.post<SignupReq>(
    `${PREFIX}/signup`,
    { preHandler: [multer, sanitizer] },
    usersController.signup
  );

  server.put<UpdateUserReq>(
    `${PREFIX}/:id`,
    { preHandler: [auth, sanitizer, multer] },
    usersController.updateUser
  );

  server.post<VerifyTokenReq>(
    `${PREFIX}/:id/verify-token`,
    { preHandler: sanitizer },
    usersController.verifyToken
  );

  server.post<LikeOrDislikeEventReq>(
    `${PREFIX}/:id/likes/events/:eventId`,
    { preHandler: [sanitizer, auth] },
    usersController.likeOrDislikeEvent
  );
};

export default fp(UserRoute);
