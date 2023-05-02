import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthUsersService } from './auth-users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';
import { EncryptionsService } from './encryptions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserService: AuthUsersService,
    private readonly encryptionsService: EncryptionsService,
  ) {}

  public async loginByPhoneNumber(
    loginByPhoneNumberDto: LoginByPhoneNumberDto,
  ): Promise<{ token: string }> {
    const { phoneNumber, password } = loginByPhoneNumberDto;

    const { password: userPassword, id: userId } =
      await this.authUserService.findOneOrFail(
        { phoneNumber },
        { selects: ['password'] },
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

    return { token: this.encryptionsService.signJwt({ id: userId }) };
  }
}
