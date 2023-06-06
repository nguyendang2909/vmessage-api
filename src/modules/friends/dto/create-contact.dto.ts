import { ApiProperty } from '@nestjs/swagger';
import { JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ stripUnknown: true })
export class RequestFriendDto {
  @ApiProperty({ type: String })
  friendId!: string;
}
