import { JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from '../../../commons/dto/find.dto';

@JoiSchemaOptions({ stripUnknown: true })
export class FindAllRoomsDto extends FindDto {}
