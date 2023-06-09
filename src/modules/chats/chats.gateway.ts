import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WsValidationPipe } from '../../commons/pipes/ws-validation-pipe';
import { ChatsService } from './chats.service';
import {
  sendChangeMessageSchema,
  SendChatMessageDto,
} from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({
  namespace: '/chats',
  cors: true,
  origin: '*',
})
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer() private readonly server!: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  @UseGuards(WsAuthGuard)
  @UsePipes(new WsValidationPipe(sendChangeMessageSchema))
  @SubscribeMessage('sendMsg')
  public async create(
    @MessageBody() sendChatMessageDto: SendChatMessageDto,
    socket: Socket,
  ) {
    return await this.chatsService.sendMessage(sendChatMessageDto, socket);
  }

  @SubscribeMessage('findAllChats')
  findAll() {
    return this.chatsService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatsService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
  }

  private async handleConnection(socket: Socket) {
    return await this.chatsService.handleConnection(socket);
  }

  private async handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
