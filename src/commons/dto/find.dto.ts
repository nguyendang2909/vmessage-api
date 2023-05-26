import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FindDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  @IsArray()
  f: string[];
}
