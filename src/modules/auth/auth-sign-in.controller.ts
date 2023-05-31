import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { AuthSignInService } from './auth-sign-in.service';
import { SignInByPhoneNumberWithPasswordDto } from './dto/login-by-phone-number.dto';
import { SignInByPhoneNumberDto } from './dto/register-auth.dto';

@Controller('/auth/sign-in')
@ApiTags('/auth/sign-in')
@ApiBearerAuth('JWT')
export class AuthSignInController {
  constructor(private readonly authSignInService: AuthSignInService) {}

  @Post('/phone-number')
  @IsPublicEndpoint()
  private async signInByPhoneNumber(
    @Body() signInByPhoneNumberDto: SignInByPhoneNumberDto,
  ) {
    return {
      type: 'sigInByPhoneNumber',
      data: await this.authSignInService.signInByPhoneNumber(
        signInByPhoneNumberDto,
      ),
    };
  }

  @Post('/phone-number/password')
  @IsPublicEndpoint()
  private async signInByPhoneNumberWithPassword(
    @Body()
    signInByPhoneNumberWithPasswordDto: SignInByPhoneNumberWithPasswordDto,
  ) {
    return {
      type: 'signInByPhoneNumberWithPassword',
      data: await this.authSignInService.signInByPhoneNumberWithPassword(
        signInByPhoneNumberWithPasswordDto,
      ),
    };
  }
}
