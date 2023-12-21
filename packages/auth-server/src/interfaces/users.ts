import { UserAttrs } from 'models/User';

export interface UserParams {
  id: string;
}

export interface GetUserReq {
  Params: UserParams;
  Body?: { _id?: string };
}

export interface LoginReq {
  Body: { email: string; password: string };
}

export interface SignupReq {
  Body: UserAttrs;
}

export interface UpdateUserReq {
  Params: UserParams;
  Body: Partial<UserAttrs>;
}

export interface VerifyTokenReq {
  Params: UserParams;
  Body: { token: string };
}

export interface LikeOrDislikeEventReq {
  Params: {
    id: string;
    eventId: string;
  };
}
