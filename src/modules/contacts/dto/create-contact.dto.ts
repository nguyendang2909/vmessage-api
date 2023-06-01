import { ApiProperty } from '@nestjs/swagger';
import { JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({})
export class CreateContactDto {
  @ApiProperty({ type: String })
  friendId!: string;
}
