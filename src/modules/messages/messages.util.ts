import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import {
  EntityFindManyOptions,
  EntityFindOneOptions,
} from '../../commons/types/find-options.type';
import { Message } from './entities/message.entity';

export class MessagesUtil {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  public async create(entity: Message) {
    const createResult = await this.messageRepository.save(entity);
    return createResult;
  }

  public async findOne(
    options: EntityFindOneOptions<Message>,
  ): Promise<Message | null> {
    return await this.messageRepository.findOne(options);
  }

  public async findMany(
    options: EntityFindManyOptions<Message>,
  ): Promise<Message[] | null> {
    return await this.messageRepository.find(options);
  }

  public async updateOneById(
    id: string,
    options: QueryDeepPartialEntity<Message>,
    currentUserId: string,
  ): Promise<boolean> {
    const updateResult = await this.messageRepository.update(
      { id },
      { ...options, updatedBy: currentUserId },
    );
    return Boolean(updateResult.affected);
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.messageRepository.softDelete({ id });
    return Boolean(deleteResult.affected);
  }
}
