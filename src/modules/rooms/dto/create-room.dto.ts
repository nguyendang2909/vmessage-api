import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsArray()
  userIds: string[];
}
