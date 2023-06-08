import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { UsersAuthUtil } from '../users/auth-users.util';
import { EUserStatus } from '../users/users.enum';
import { UsersUtil } from '../users/users.util';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly usersUtil: UsersUtil,
    private readonly usersAuthUtil: UsersAuthUtil,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  public async handleConnection(socket: Socket) {
    const { authorization } = socket.handshake.headers;
    const token = authorization?.split(' ')[1];
    if (token) {
      const decodedToken = this.encryptionsUtil.verifyJwt(token);
      const user = await this.usersAuthUtil.findOneById(decodedToken.id);
      if (user && user.status !== EUserStatus.banned) {
        socket.handshake.user = user;
        this.logger.log(`Socket connected: ${socket.id}`);
        return;
      }
    }

    socket.disconnect();
  }
}
