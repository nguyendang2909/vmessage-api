import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { MoreThan, Repository } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { FindManyRoomsDto } from './dto/find-many-room.dto';
import { FindOneRoomByIdDto } from './dto/find-one-room-by-id.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  public async create(createRoomDto: CreateRoomDto, currentUserId: string) {
    const { userIds } = createRoomDto;
    const uniqueUserIds = _.union(userIds, currentUserId);
    const createResult = await this.roomRepository.save({
      users: uniqueUserIds.map((userId) => new User({ id: userId })),
    });

    return createResult;
  }

  public async findMany(
    findManyRoomsDto: FindManyRoomsDto,
    currentUserId: string,
  ) {
    const { cursor, f } = findManyRoomsDto;
    const findResult = await this.roomRepository.find({
      where: {
        users: new User({ id: currentUserId }),
        ...(cursor ? { id: MoreThan(cursor) } : {}),
      },
      take: 20,
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  public async findOneById(
    id: string,
    findOneRoomByIdDto: FindOneRoomByIdDto,
    currentUserId: string,
  ) {
    const { f } = findOneRoomByIdDto;
    const findResult = await this.roomRepository.findOne({
      where: {
        id,
        users: new User({ id: currentUserId }),
      },
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return findResult;
  }

  public async findOneOrFailById(
    id: string,
    findOneRoomByIdDto: FindOneRoomByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOneById(
      id,
      findOneRoomByIdDto,
      currentUserId,
    );
    if (!findResult) {
      throw new BadRequestException('Room not found!');
    }

    return findResult;
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {}
}
