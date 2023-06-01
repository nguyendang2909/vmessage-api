import { JoiSchemaOptions } from 'nestjs-joi';

import { DtoFactory } from '../../../commons/lib/dto-factory.lib';
import { FindAllContactsDto } from './find-all-contacts.dto';

@JoiSchemaOptions({})
export class FindManyContactsDto extends DtoFactory.findManyByCursor(
  FindAllContactsDto,
) {}
