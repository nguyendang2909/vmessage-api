import { ERole } from '../users/users.enum';

export type AuthJwtPayload = {
  sub: string;
  id: string;
  role: ERole;
  iat: number;
  exp: number;
};

export type AuthJwtSignPayload = {
  sub: string;
  id: string;
  role: ERole;
};

export type FindOneAuthUserConditions = {
  phoneNumber?: string;
};

export type CreateUserPayload = {
  phoneNumber?: string;
};
