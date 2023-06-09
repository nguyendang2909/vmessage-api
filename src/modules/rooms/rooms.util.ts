import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import {
  EntityFindManyOptions,
  EntityFindOneByIdOptions,
  EntityFindOneOptions,
} from '../../commons/types/find-options.type';
import { Room } from './entities/room.entity';

export class RoomsUtil {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  public async create(entity: Room) {
    const createResult = await this.roomRepository.save(entity);
    return createResult;
  }

  public async findOne(
    options: EntityFindOneOptions<Room>,
  ): Promise<Room | null> {
    return await this.roomRepository.findOne(options);
  }

  public async findOneById(
    id: string,
    options: EntityFindOneByIdOptions<Room>,
  ): Promise<Room | null> {
    return await this.roomRepository.findOne({
      ...options,
      where: { id },
    });
  }

  public async findMany(
    options: EntityFindManyOptions<Room>,
  ): Promise<Room[] | null> {
    return await this.roomRepository.find(options);
  }

  public async updateOneById(
    id: string,
    options: QueryDeepPartialEntity<Room>,
    currentUserId: string,
  ): Promise<boolean> {
    const updateResult = await this.roomRepository.update(
      { id },
      { ...options, updatedBy: currentUserId },
    );
    return Boolean(updateResult.affected);
  }

  public async delete(id: string) {
    const deleteResult = await this.roomRepository.softDelete({ id });
    return Boolean(deleteResult.affected);
  }
}
