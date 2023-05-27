import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthUsersService } from './auth-users.service';
import { CanRegisterDto } from './dto/check-can-register.dto';
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
  ) {
    const { token, firstName, lastName } = registerByPhoneNumberDto;

    const decoded = await this.firebaseService.decodeToken(token);

    const phoneNumber = decoded.phone_number;

    return await this.authUserService.createByPhoneNumber({
      firstName,
      lastName,
      phoneNumber,
    });
  }

  public async checkCanRegister(canRegisterDto: CanRegisterDto) {
    return !(await this.authUserService.findOne(canRegisterDto, {
      selects: ['id'],
    }));
  }

  public async loginByPhoneNumber(
    loginByPhoneNumberDto: LoginByPhoneNumberDto,
  ): Promise<{ token: string }> {
    const { phoneNumber, password } = loginByPhoneNumberDto;

    const {
      password: userPassword,
      id: userId,
      role: userRole,
    } = await this.authUserService.findOneOrFail(
      { phoneNumber },
      { selects: ['password', 'id', 'role'] },
    );

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
      token: this.encryptionsService.signJwt({
        id: userId,
        sub: userId,
        role: userRole,
      }),
    };
  }
}
