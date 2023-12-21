import jwt from 'jsonwebtoken';
import { UserRole } from '../../src/models/User';

export const getToken = (secretKey: string, userId: string): string => {
  return jwt.sign({ userId, role: UserRole.admin }, secretKey, {
    expiresIn: '72h',
  });
};
