import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInByPhoneNumberDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  token: string;
}
