import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({})
export class FindDto {
  @ApiProperty({ type: [String] })
  @Transform(({ value }) => value.split(','))
  @JoiSchema(Joi.array().items(Joi.string().required()).required())
  f: string[];
}
