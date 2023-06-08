import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Room } from './entities/room.entity';

export class RoomsUtil {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}
}
