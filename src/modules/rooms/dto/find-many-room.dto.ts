import { JoiSchemaOptions } from 'nestjs-joi';

import { DtoFactory } from '../../../commons/lib/dto-factory.lib';
import { FindAllRoomsDto } from './find-all-room.dto';

@JoiSchemaOptions({})
export class FindManyRoomsDto extends DtoFactory.findManyByCursor(
  FindAllRoomsDto,
) {}
