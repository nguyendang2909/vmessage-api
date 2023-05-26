import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { AuthService } from './auth.service';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('JWT')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/phone-numbe')
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
