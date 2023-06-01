import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EContactStatus } from '../contacts.enum';

@JoiSchemaOptions({})
export class UpdateContactDto {
  @ApiPropertyOptional({ type: String, enum: EContactStatus })
  @JoiSchema(
    Joi.string()
      .optional()
      .valid(...Object.values(EContactStatus)),
  )
  status?: EContactStatus;
}
