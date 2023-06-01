import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class IsExistUserDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  @IsPhoneNumber()
  phoneNumber?: string;
}
