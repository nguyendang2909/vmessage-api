import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

import { EGender } from '../users.enum';

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEnum(EGender)
  gender: EGender;
}
