export interface IUser {
  _id: string;
  username: string;
  lastName: string;
  firstName: string;
  email: string;
  role: UserRole;
  customerId: string;
  isActive: boolean;
  photo?: string;
  password?: string;
  deletedAt?: Date;
  createdAt:string;
  updatedAt: string;
}

export enum UserRole {
  admin = 'admin',
  user = 'user',
  adherent = 'adherent',
  student = 'student',
}

export type UserSignup = Omit<
  IUser,
  | '_id'
  | 'createdAt'
  | 'updatedAt'
  
> & {
  password: string;
  confirmPassword: string;
  photo: File[];
  [key: string]: any;
};

export type UpdateUser = Partial<
  Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'role' | 'likedEvents'>
> & {
  password: string;
  confirmPassword: string;
  photo: File[];
  [key: string]: any;
};

export type Login = {
  username: string;
  password: string;
};

export type UserDeleted = {
  nDeleted: number;
};

export type UserAuth = {
  token: string;
  id: IUser['_id'];
};

export type FetchUser = {
  user: IUser;
};

export type FetchUsers = {
  users: IUser[];
};

export type IsTokenValid = {
  isValid: boolean;
};

export type UserContextType = {
  user: IUser | null;
  login: (payload: Login) => Promise<IUser>;
  signup: (payload: FormData) => Promise<IUser>;
  logout: () => void;
  updateUser: (payload: Partial<IUser> | FormData, userId: string) => Promise<IUser>;
  deleteUser: (userId: string) => Promise<UserDeleted>;
  isLoading: boolean;
};
