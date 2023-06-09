import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ArrayContains } from 'typeorm';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { MessagesUtil } from '../messages/messages.util';
import { Room } from '../rooms/entities/room.entity';
import { RoomsUtil } from '../rooms/rooms.util';
import { UsersAuthUtil } from '../users/auth-users.util';
import { EUserStatus } from '../users/users.enum';
import { UsersUtil } from '../users/users.util';
import { SendChatMessageDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly usersUtil: UsersUtil,
    private readonly usersAuthUtil: UsersAuthUtil,
    private readonly roomsUtil: RoomsUtil,
    private readonly messagesUtil: MessagesUtil,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(
    sendChatMessageDto: SendChatMessageDto,
    socket: Socket,
  ) {
    const {
      roomId,
      targetUserId,
      likeUserIds,
      loveUserIds,
      replyMessageId,
      text,
    } = sendChatMessageDto;
    const currentUserId = socket.handshake.user.id;
    const userIds = [currentUserId, targetUserId].sort();
    let room: Room;
    if (roomId) {
      const existRoom = await this.roomsUtil.findOneById(roomId, {
        select: {
          id: true,
        },
      });
      if (!existRoom) {
        throw new WsException({
          errorCode: 'ROOM_DOES_NOT_EXIST',
          message: 'Room does not exist!',
        });
      }
      room = existRoom;
    } else {
      const existRoom = await this.roomsUtil.findOne({
        where: {
          userIds: ArrayContains(userIds),
        },
        select: { id: true },
      });
      if (!existRoom) {
        room = await this.roomsUtil.create({
          userIds,
          createdBy: currentUserId,
          updatedBy: currentUserId,
        });
      }
    }
    socket.emit(currentUserId, sendChatMessageDto);
    socket.emit(targetUserId, sendChatMessageDto);
    await this.messagesUtil.create({
      createdBy: currentUserId,
      updatedBy: currentUserId,
      userId: currentUserId,
      ...(likeUserIds ? { likeUserIds } : {}),
      ...(loveUserIds ? { loveUserIds } : {}),
      ...(replyMessageId ? { replyMessageId } : {}),
      ...(text ? { text } : {}),
    });
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
      const userId = user?.id;
      if (user && user.status !== EUserStatus.banned && userId) {
        socket.handshake.user = { ...user, id: userId };
        socket.join(userId);
        this.logger.log(`Socket connected: ${socket.id}`);
        return;
      }
    }

    socket.disconnect();
  }
}
