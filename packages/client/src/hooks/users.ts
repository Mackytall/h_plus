import { useSecureQuery } from './useQuery';
import { reactQueryKeys } from '../constants/reactQueryKeys';
import { urls } from '../configurations';
import { useQueryClient, useMutation } from 'react-query';
import { FetchSecureReturn, fetchSecure } from '../helper/fetchHelper';
import { FetchUser, IsTokenValid, IUser, Login, UserAuth, UserDeleted } from '../types/user';
import { storage } from '../constants';

const usersUrl = urls.users;

export const useUsers = () =>
  useSecureQuery<IUser[]>(reactQueryKeys.users, {
    url: `${usersUrl}`,
    method: 'GET',
    path: 'data.users',
    secure: true,
  });

export const useUser = (id: string | null) =>
  useSecureQuery<IUser>([reactQueryKeys.users, id], {
    url: `${usersUrl}/${id}`,
    method: 'GET',
    path: 'data.user',
    secure: true,
    enabled: !!id && id !== 'null',
  });

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: UserAuth | null) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const login = useMutation(
    ({ login }: { login: Login }) =>
      fetchSecure<UserAuth>(`${usersUrl}/login`, {
        method: 'POST',
        body: JSON.stringify(login),
        throwOnError: true,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(reactQueryKeys.users);
        if (onSuccess) onSuccess(res.data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    }
  );
  return login;
};

export const useSignup = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: UserAuth | null) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const signup = useMutation(
    ({ signup }: { signup: FormData }) =>
      fetchSecure<UserAuth>(`${usersUrl}/signup`, {
        method: 'POST',
        body: signup,
        throwOnError: true,
        specifyTypeContent: false,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(reactQueryKeys.users);
        if (onSuccess) onSuccess(res.data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    }
  );
  return signup;
};

export const useUpdateUser = ({
  onSuccess,
  onError,
  userId,
}: {
  onSuccess?: (data: FetchUser | null) => void;
  onError?: (error: any) => void;
  userId?: IUser['_id'];
}) => {
  const queryClient = useQueryClient();
  const updateUser = useMutation(
    ({ user, userId }: { user: Partial<IUser> | FormData; userId: IUser['_id'] }) =>
      fetchSecure<FetchUser>(`${usersUrl}/${userId}`, {
        method: 'PUT',
        body: user instanceof FormData ? user : JSON.stringify(user),
        throwOnError: true,
        secure: true,
        specifyTypeContent: user instanceof FormData ? false : true,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(reactQueryKeys.users);
        queryClient.invalidateQueries([reactQueryKeys.users, userId]);
        if (onSuccess) onSuccess(res.data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    }
  );
  return updateUser;
};

export const useDeleteUser = ({
  onSuccess,
  onError,
  userId,
}: {
  onSuccess?: (data: UserDeleted | null) => void;
  onError?: (error: any) => void;
  userId?: IUser['_id'];
}) => {
  const queryClient = useQueryClient();
  const deleteUser = useMutation(
    ({ userId }: { userId: IUser['_id'] }) =>
      fetchSecure<UserDeleted>(`${usersUrl}/${userId}`, {
        method: 'DELETE',
        throwOnError: true,
        secure: true,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(reactQueryKeys.users);
        queryClient.invalidateQueries([reactQueryKeys.users, userId]);
        if (onSuccess) onSuccess(res.data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    }
  );
  return deleteUser;
};

export const useTokenValid = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: IsTokenValid | null) => void;
  onError?: (error: any) => void;
}) => {
  const checkIfTokenIsValid = useMutation(
    ({ userId }: { userId: IUser['_id'] }) =>
      fetchSecure<IsTokenValid>(`${usersUrl}/${userId}/verify-token`, {
        method: 'POST',
        body: JSON.stringify({ token: localStorage.getItem(storage.USER_TOKEN) }),
        throwOnError: true,
      }),
    {
      onSuccess: (res) => {
        if (onSuccess) onSuccess(res.data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    }
  );
  return checkIfTokenIsValid;
};

export const fetchUser = (id: string): FetchSecureReturn<{ user: IUser }> =>
  fetchSecure<{ user: IUser }>(`${usersUrl}/${id}`, {
    method: 'GET',
    secure: true,
  });
