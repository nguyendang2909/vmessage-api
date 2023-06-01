import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { EUserStatus } from '../users/users.enum';
import { SignInData } from './auth.type';
import { AuthUsersService } from './auth-users.service';
import { SignInWithPhoneNumberAndPasswordDto } from './dto/login-by-phone-number.dto';
import { SignInWithPhoneNumberDto } from './dto/register-auth.dto';
import { EncryptionsService } from './encryptions.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly authUsersService: AuthUsersService,
    private readonly encryptionsService: EncryptionsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  public async signInWithPhoneNumber(
    signInByPhoneNumberDto: SignInWithPhoneNumberDto,
  ): Promise<SignInData> {
    const { token } = signInByPhoneNumberDto;
    const decoded = await this.firebaseService.decodeToken(token);
    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      throw new BadRequestException('Token is invalid!');
    }
    let user = await this.authUsersService.findOne(
      { phoneNumber },
      {
        selects: ['status', 'role'],
      },
    );
    if (user) {
      const { status } = user;
      if (status && status === EUserStatus.banned) {
        throw new ForbiddenException('You have been banned!');
      }
    } else {
      user = await this.authUsersService.create({
        phoneNumber,
      });
    }
    const { id, role } = user;
    if (!id || !role) {
      throw new BadRequestException('User is not correct!');
    }

    return {
      accessToken: this.encryptionsService.signJwt({
        sub: id,
        id,
        role,
      }),
    };
  }

  public async signInWithPhoneNumberAndPassword(
    signInByPhoneNumberWithPasswordDto: SignInWithPhoneNumberAndPasswordDto,
  ): Promise<SignInData> {
    const { phoneNumber, password } = signInByPhoneNumberWithPasswordDto;
    const {
      password: userPassword,
      id: userId,
      role: userRole,
    } = await this.authUsersService.findOneOrFail(
      { phoneNumber },
      { selects: ['password', 'id', 'role'] },
    );
    if (!userId || !userPassword || !userRole) {
      throw new BadRequestException('Try login with OTP!');
    }
    const isMatchPassword = this.encryptionsService.isMatchWithHashedKey(
      password,
      userPassword,
    );
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Phone number or password is not correct!',
      );
    }

    return {
      accessToken: this.encryptionsService.signJwt({
        id: userId,
        sub: userId,
        role: userRole,
      }),
    };
  }
}
