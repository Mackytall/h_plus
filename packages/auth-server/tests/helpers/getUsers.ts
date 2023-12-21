import server from '../../src';
import { UserDocument } from '../../src/models/User';

export const getUsers = async (token: string): Promise<UserDocument[]> => {
  const response = await server.inject({
    method: 'GET',
    path: `/api/users`,
    headers: {
      authorization: token,
    },
  });
  const data = await response.json();
  return data.users;
};

export const getUserById = async (token: string, userId: string): Promise<UserDocument> => {
  const response = await server.inject({
    method: 'GET',
    path: `/api/users/${userId}`,
    headers: {
      authorization: token,
    },
  });
  const data = await response.json();
  return data.user;
};
