import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsUtil } from './rooms.util';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [RoomsUtil],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsUtil],
})
export class RoomsModule {}
