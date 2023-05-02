import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { FindManyDto } from './find-many.dto';

export class FindManyByLastIdDto extends FindManyDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  lastId?: string;
}
