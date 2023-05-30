import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class IsExistUserDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;
}
