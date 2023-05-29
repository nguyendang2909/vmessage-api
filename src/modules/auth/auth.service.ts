import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthUsersService } from './auth-users.service';
import { IsExistUserDto } from './dto/is-exist-user.dto';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';
import { RegisterByPhoneNumberDto } from './dto/register-auth.dto';
import { EncryptionsService } from './encryptions.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserService: AuthUsersService,
    private readonly encryptionsService: EncryptionsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  public async registerByPhoneNumber(
    registerByPhoneNumberDto: RegisterByPhoneNumberDto,
  ): Promise<{ accessToken: string }> {
    const { token, firstName, lastName } = registerByPhoneNumberDto;
    const decoded = await this.firebaseService.decodeToken(token);

    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      throw new BadRequestException('Token is invalid!');
    }

    const user = await this.authUserService.createByPhoneNumber({
      firstName,
      lastName,
      phoneNumber,
    });

    const { id, role } = user;
    if (!id || !role) {
      throw new BadRequestException();
    }

    return {
      accessToken: this.encryptionsService.signJwt({
        sub: id,
        id,
        role,
      }),
    };
  }

  public async isExistUser(isExistUserDto: IsExistUserDto): Promise<boolean> {
    const user = await this.authUserService.findOne(isExistUserDto, {
      selects: ['id'],
    });
    return Boolean(user);
  }

  public async loginByPhoneNumber(
    loginByPhoneNumberDto: LoginByPhoneNumberDto,
  ): Promise<{ accessToken: string }> {
    const { phoneNumber, password } = loginByPhoneNumberDto;

    const {
      password: userPassword,
      id: userId,
      role: userRole,
    } = await this.authUserService.findOneOrFail(
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
