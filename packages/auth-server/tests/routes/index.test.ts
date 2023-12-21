import server from '../../src/index';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getToken, getUserById, getUsers } from '../helpers';
import { userToInsert, users as usersData } from '../fixtures';
import { User } from '../../src/models/User';

let token: string | undefined;

beforeEach(async () => {
  await User.insertMany(usersData);
  const user = await User.findOne({ email: usersData[0].email });
  if (user) {
    token = `Bearer ${getToken(server.config.JWT_TOKEN, user._id)}`;
  }
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('CRUD users', () => {
  it('Should return an object with an array of users', async () => {
    const response = await server.inject({
      method: 'GET',
      path: '/api/users',
      headers: {
        authorization: token,
      },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual(
      expect.objectContaining({
        users: expect.any(Array),
      })
    );
    expect(data.users).toHaveLength(15);
  });

  it('Should return unauthorized request', async () => {
    const response = await server.inject({
      method: 'GET',
      path: '/api/users',
    });
    expect(response.statusCode).toBe(401);
  });

  it('Should return the user by id', async () => {
    const users = await getUsers(token ?? '');
    const response = await server.inject({
      method: 'GET',
      path: `/api/users/${users?.[0]._id}`,
      headers: {
        authorization: token,
      },
    });
    const data = await response.json();
    expect(response.statusCode).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
      })
    );
    expect(data.user._id).eq(users?.[0]._id);
  });

  it('Should update user by id', async () => {
    const [userToUpdate] = await getUsers(token ?? '');
    const response = await server.inject({
      method: 'PUT',
      path: `/api/users/${userToUpdate._id}`,
      headers: {
        authorization: token,
      },
      payload: {
        firstName: `${userToUpdate.firstName}-TU`,
      },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual({ message: 'Utilisateur mis à jour avec succès' });
    const userUpdated = await getUserById(token ?? '', userToUpdate._id);
    expect(userUpdated.firstName).toEqual(`${userToUpdate.firstName}-TU`);
  });
});

describe('Login and signup', () => {
  it('Should signup user', async () => {
    const response = await server.inject({
      method: 'POST',
      path: '/api/users/signup',
      payload: userToInsert,
    });
    const data = await response.json();
    expect(response.statusCode).eq(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        token: expect.any(String),
      })
    );
  });

  it('Should login user', async () => {
    const response = await server.inject({
      method: 'POST',
      path: '/api/users/login',
      payload: { email: usersData[0].email, password: 'password' },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        token: expect.any(String),
      })
    );
  });
});

describe('Verify token', () => {
  it('Should send token as valid', async () => {
    const [user] = await getUsers(token ?? '');
    const response = await server.inject({
      method: 'POST',
      path: `/api/users/${user._id}/verify-token`,
      payload: { token: token?.split(' ')[1] },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual({ isValid: true });
  });

  it('Should send token as invalid if user does not exist', async () => {
    const response = await server.inject({
      method: 'POST',
      path: `/api/users/falseid/verify-token`,
      payload: { token: token?.split(' ')[1] },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual({ isValid: false });
  });

  it('Should send token as invalid', async () => {
    const [user] = await getUsers(token ?? '');
    const response = await server.inject({
      method: 'POST',
      path: `/api/users/${user._id}/verify-token`,
      payload: { token: 'random-token' },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual({ isValid: false });
  });
});

describe('Like or dislike events', () => {
  it('Should like an event', async () => {
    const [user] = await getUsers(token ?? '');
    const eventId = '63825f8773bbb154c8e0a1b3';
    const response = await server.inject({
      method: 'POST',
      path: `/api/users/${user._id}/likes/events/${eventId}`,
      headers: {
        authorization: token,
      },
    });
    const data = await response.json();
    expect(response.statusCode).eq(200);
    expect(data).toEqual({ message: 'Événement ajouté aux favoris !' });
    const updatedUser = await getUserById(token ?? '', user._id);
    const isEventPresent = updatedUser.likedEvents.includes(eventId);
    expect(isEventPresent).toEqual(true);
  });

  it('Should dislike an event', async () => {
    const users = await getUsers(token ?? '');
    const user = users.find((user) => user.likedEvents.length);
    if (user) {
      const eventId = user.likedEvents[0];
      const response = await server.inject({
        method: 'POST',
        path: `/api/users/${user._id}/likes/events/${eventId}`,
        headers: {
          authorization: token,
        },
      });
      const data = await response.json();
      expect(response.statusCode).eq(200);
      expect(data).toEqual({ message: 'Événement supprimé des favoris.' });
      const updatedUser = await getUserById(token ?? '', user._id);
      const isEventPresent = updatedUser.likedEvents.includes(eventId);
      expect(isEventPresent).toEqual(false);
    }
  });
});
