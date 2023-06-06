import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EFriendStatus } from '../friends.enum';

@JoiSchemaOptions({ stripUnknown: true })
export class UpdateContactDto {
  @ApiPropertyOptional({ type: Number, enum: EFriendStatus })
  @JoiSchema(
    Joi.string()
      .optional()
      .valid(...Object.values(EFriendStatus)),
  )
  status?: EFriendStatus;
}
