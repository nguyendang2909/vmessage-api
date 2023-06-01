import { JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from '../../../commons/dto/find.dto';

@JoiSchemaOptions({})
export class FindOneUserByIdDto extends FindDto {}
