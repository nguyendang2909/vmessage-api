import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { AuthService } from './auth.service';
import { CanRegisterDto } from './dto/check-can-register.dto';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';
import { RegisterByPhoneNumberDto } from './dto/register-auth.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('JWT')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register/phone-number')
  @IsPublicEndpoint()
  private async registerByPhoneNumber(
    @Body() registerByPhoneNumberDto: RegisterByPhoneNumberDto,
  ) {
    return {
      type: 'registerByPhoneNumber',
      data: await this.authService.registerByPhoneNumber(
        registerByPhoneNumberDto,
      ),
    };
  }

  @Post('/register/can-register')
  @IsPublicEndpoint()
  private async checkCanRegister(@Body() checkCanRegisterDto: CanRegisterDto) {
    return {
      type: 'canRegisterByPhoneNumber',
      data: {
        ...checkCanRegisterDto,
        canRegister: await this.authService.checkCanRegister(
          checkCanRegisterDto,
        ),
      },
    };
  }

  @Post('/login/phone-number')
  @IsPublicEndpoint()
  private async loginByPhoneNumber(
    @Body() loginByPhoneNumberDto: LoginByPhoneNumberDto,
  ) {
    return {
      type: 'loginByPhoneNumber',
      data: await this.authService.loginByPhoneNumber(loginByPhoneNumberDto),
    };
  }
}
