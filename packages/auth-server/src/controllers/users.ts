import { FastifyReply, FastifyRequest } from 'fastify';
import {
  MulterRequest,
  LoginReq,
  SignupReq,
  UpdateUserReq,
  VerifyTokenReq,
  GetUserReq,
  LikeOrDislikeEventReq,
} from '../interfaces';
import { errorResponse } from '../helpers/errorHelper';
import { UserDocument, UserRole } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { s3 } from '../middlewares/multer-config';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export const getUsers = async (req: FastifyRequest, res: FastifyReply) => {
  const { User } = req.server.db.models;
  try {
    const users = await User.getAll();
    return res.code(200).send({ users });
  } catch (e) {
    return errorResponse(req, res, e);
  }
};

export const getUser = async (req: FastifyRequest<GetUserReq>, res: FastifyReply) => {
  const { User } = req.server.db.models;
  try {
    if (req.role === UserRole.admin || req.userId === req.params.id) {
      const user = await User.getById(req.params.id);
      if (!user) {
        throw new Error('Utilisateur introuvable avec cet identifiant');
      }
      return res.code(200).send({ user });
    }
    return res.code(403).send({ error: "Vous n'avez pas le droit d'accèder à cette ressource" });
  } catch (e) {
    return errorResponse(req, res, e);
  }
};

export const login = async (req: FastifyRequest<LoginReq>, res: FastifyReply) => {
  const { User } = req.server.db.models;
  try {
    const user: UserDocument | null = await User.getByEmail(req.body.email, true);
    if (!user) return res.code(404).send({ error: 'Utilisateur pas trouvé' });
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.code(401).send({ error: 'Mot de passe incorrect' });
    return res.code(200).send({
      id: user._id,
      token: jwt.sign({ userId: user._id, role: user.role }, req.server.config.JWT_TOKEN, {
        expiresIn: '72h',
      }),
    });
  } catch (e) {
    return errorResponse(req, res, e);
  }
};

export const signup = async (req: FastifyRequest<SignupReq>, res: FastifyReply) => {
  const { User } = req.server.db.models;
  try {
    const userFound = await User.getByEmail(req.body.email);
    if (userFound) {
      return res.code(409).send({ error: 'Cette adresse mail est déjà utilisée.' });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = User.add({
      ...req.body,
      password: hash,
      photo: (req as MulterRequest).file?.location,
    });
    await user.save();
    return res.code(201).send({
      id: user._id,
      token: jwt.sign({ userId: user._id, role: user.role }, req.server.config.JWT_TOKEN, {
        expiresIn: '72h',
      }),
    });
  } catch (e) {
    return errorResponse(req, res, e);
  }
};

export const updateUser = async (req: FastifyRequest<UpdateUserReq>, res: FastifyReply) => {
  const { User } = req.server.db.models;
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.code(404).send({ error: 'Aucun utilisateur troouvé' });

    const newPhoto = !!(req as MulterRequest).file;

    if (req.body.email && user.email !== req.body.email) {
      const userExists = await User.getByEmail(req.body.email);
      if (userExists) return res.code(409).send({ error: 'Cet adresse mail est déjà utilisée' });
    }

    if (newPhoto && user.photo) {
      const photoKey = user.photo.split('/users/')[1];
      const params = { Bucket: 'users', Key: photoKey };
      try {
        await s3.send(new DeleteObjectCommand(params));
      } catch (err) {
        req.log.warn(err);
      }
    }

    const newUser = {
      ...req.body,
    };

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      newUser.password = hash;
    }

    if (newPhoto) {
      newUser.photo = (req as MulterRequest).file?.location;
    }

    if (newUser.password === null) {
      delete newUser.password;
    }

    await User.updateUser(req.params.id, { ...newUser });
    return res.code(200).send({ message: 'Utilisateur mis à jour avec succès' });
  } catch (e) {
    return errorResponse(req, res, e);
  }
};

export const verifyToken = async (req: FastifyRequest<VerifyTokenReq>, res: FastifyReply) => {
  const { User } = req.server.db.models;
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.code(404).send({ error: 'Aucun utilisateur trouvé' });
    const decodedToken = jwt.verify(req.body.token, req.server.config.JWT_TOKEN);
    if (decodedToken) return res.code(200).send({ isValid: true });
    throw new Error('Invalid token');
  } catch (error: unknown) {
    req.log.error(error);
    return res.code(200).send({ isValid: false });
  }
};

export const likeOrDislikeEvent = async (
  req: FastifyRequest<LikeOrDislikeEventReq>,
  res: FastifyReply
) => {
  const { User } = req.server.db.models;
  try {
    const user = await User.getById(req.params.id);
    const eventId = req.params.eventId;
    if (user.likedEvents.map((s) => s.toString()).includes(eventId)) {
      await User.dislikeEvent(user._id, eventId);
      return res.code(200).send({ message: 'Événement supprimé des favoris.' });
    } else {
      await User.likeEvent(user._id, eventId);
      return res.code(200).send({ message: 'Événement ajouté aux favoris !' });
    }
  } catch (e) {
    return errorResponse(req, res, e);
  }
};

const usersController = {
  getUsers,
  getUser,
  login,
  signup,
  updateUser,
  verifyToken,
  likeOrDislikeEvent,
};

export default usersController;
