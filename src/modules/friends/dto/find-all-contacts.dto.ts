import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from '../../../commons/dto/find.dto';
import { EFriendStatus } from '../friends.enum';

@JoiSchemaOptions({ stripUnknown: true })
export class FindAllContactsDto extends FindDto {
  @ApiProperty({ type: String, enum: EFriendStatus })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(...Object.values(EFriendStatus)),
  )
  status!: EFriendStatus;
}
