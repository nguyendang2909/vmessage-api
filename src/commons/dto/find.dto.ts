import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FindDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  fields: string[];
}
