import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { IUser, UserContextType, Login, UserDeleted } from '../types/user';
import { storage } from '../constants';
import { showErrorMessage } from '../helper/errorHandler';
import {
  useLogin,
  useTokenValid,
  useSignup,
  useUpdateUser,
  useDeleteUser,
  useUser,
  fetchUser,
} from '../hooks/users';

export const AuthContext = createContext<UserContextType | null>(null);

export interface IAuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const userId = localStorage.getItem(storage.USER_ID);
  const [updatedUser, setUpdatedUser] = useState<IUser | null>(null);
  const { data: userFetched, refetch, isLoading } = useUser(userId);
  const [loggedOut, setLoggedOut] = useState(false);
  const user = useMemo(() => {
    if (isLoading || !userFetched || loggedOut) return null;
    if (updatedUser) return updatedUser;
    return userFetched;
  }, [isLoading, userFetched, loggedOut, updatedUser]);
  const { mutateAsync: logUser } = useLogin({});
  const { mutateAsync: checkIfTokenIsValid } = useTokenValid({});
  const { mutateAsync: signupUser } = useSignup({});
  const { mutateAsync: update } = useUpdateUser({ userId: user?._id });
  const { mutateAsync: removeUser } = useDeleteUser({});

  const logout = useCallback(() => {
    localStorage.removeItem(storage.USER_TOKEN);
    localStorage.removeItem(storage.USER_ID);
    setLoggedOut(true);
  }, []);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem(storage.USER_TOKEN);
      if (!token || !user?._id) return;

      checkIfTokenIsValid({ userId: user._id })
        .then((res) => {
          if (res.data && res.data.isValid) return;
          logout();
          document.location.pathname = '/connexion';
        })
        .catch((error) => {
          console.error({ error, res: error.response });
        });
    }
  }, [user, logout, checkIfTokenIsValid]);

  const login = useCallback(
    (payload: Login) => {
      return new Promise<IUser>(async (resolve, reject) => {
        try {
          await logUser(
            { login: payload },
            {
              onSuccess: async (res) => {
                if (res.data) {
                  localStorage.setItem(storage.USER_TOKEN, res.data.token);
                  localStorage.setItem(storage.USER_ID, res.data.id);
                  setLoggedOut(false);
                  const userReq = await fetchUser(res.data.id);
                  await refetch();
                  if (userReq.ok && userReq.data) {
                    resolve(userReq.data.user);
                  }
                }
              },
              onError: (error) => {
                showErrorMessage(error);
                reject(error);
              },
            }
          );
        } catch (error) {
          reject(error);
        }
      });
    },
    [logUser, refetch]
  );

  const signup = useCallback(
    (payload: FormData) => {
      return new Promise<IUser>(async (resolve, reject) => {
        try {
          await signupUser(
            { signup: payload },
            {
              onSuccess: async (res) => {
                if (res.data) {
                  localStorage.setItem(storage.USER_TOKEN, res.data.token);
                  localStorage.setItem(storage.USER_ID, res.data.id);
                  setLoggedOut(false);
                  const userReq = await fetchUser(res.data.id);
                  await refetch();
                  if (userReq.ok && userReq.data) {
                    resolve(userReq.data.user);
                  }
                }
              },
              onError: (error) => {
                showErrorMessage(error);
                reject(error);
              },
            }
          );
        } catch (error) {
          reject(error);
        }
      });
    },
    [signupUser, refetch]
  );

  const updateUser = (payload: Partial<IUser> | FormData, userId: string) => {
    return new Promise<IUser>(async (resolve, reject) => {
      try {
        await update(
          { user: payload, userId },
          {
            onSuccess: async (res) => {
              if (res.data) {
                const newUser = await refetch();
                if (newUser.data) {
                  setUpdatedUser(newUser.data);
                  resolve(newUser.data);
                }
              }
            },
            onError: (error) => {
              showErrorMessage(error);
              reject(error);
            },
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const deleteUser = (userId: string) => {
    return new Promise<UserDeleted>(async (resolve, reject) => {
      try {
        await removeUser(
          { userId },
          {
            onSuccess: (res) => {
              if (res.data) {
                if (res.data.nDeleted < 1) {
                  throw new Error("L'utilisateur n'a pas pu être supprimé");
                }
                resolve(res.data);
              }
            },
            onError: (error) => {
              showErrorMessage(error);
              reject(error);
            },
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser, deleteUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
