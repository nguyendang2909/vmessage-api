import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { AuthSignInService } from './auth-sign-in.service';
import { SignInWithPhoneNumberAndPasswordDto } from './dto/login-by-phone-number.dto';
import { SignInWithPhoneNumberDto } from './dto/register-auth.dto';

@Controller('/auth/sign-in')
@ApiTags('/auth/sign-in')
@ApiBearerAuth('JWT')
export class AuthSignInController {
  constructor(private readonly authSignInService: AuthSignInService) {}

  @Post('/phone-number')
  @IsPublicEndpoint()
  private async signInWithPhoneNumber(
    @Body() signInByPhoneNumberDto: SignInWithPhoneNumberDto,
  ) {
    return {
      type: 'sigInWithPhoneNumber',
      data: await this.authSignInService.signInWithPhoneNumber(
        signInByPhoneNumberDto,
      ),
    };
  }

  @Post('/phone-number/password')
  @IsPublicEndpoint()
  private async signInWithPhoneNumberAndPassword(
    @Body()
    signInWithPhoneNumberAndPasswordDto: SignInWithPhoneNumberAndPasswordDto,
  ) {
    return {
      type: 'signInWithPhoneNumberAndPassword',
      data: await this.authSignInService.signInWithPhoneNumberAndPassword(
        signInWithPhoneNumberAndPasswordDto,
      ),
    };
  }
}
