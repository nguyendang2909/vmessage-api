import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesUtil } from './messages.util';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  exports: [MessagesUtil],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesUtil],
})
export class MessagesModule {}
