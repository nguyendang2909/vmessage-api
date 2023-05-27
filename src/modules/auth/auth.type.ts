import { ERole } from '../roles/roles.enum';

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

export type CreateByPhoneNumberPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};
