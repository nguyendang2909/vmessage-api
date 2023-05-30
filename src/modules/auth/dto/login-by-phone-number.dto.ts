import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInByPhoneNumberWithPasswordDto {
  @ApiProperty({ type: String, default: '+84971016191' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({ type: String, default: 'Onlyone2@' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}
