import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CanRegisterDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  phoneNumber: string;
}
