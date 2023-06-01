import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from './find.dto';

@JoiSchemaOptions({})
export class FindManyDto extends FindDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
