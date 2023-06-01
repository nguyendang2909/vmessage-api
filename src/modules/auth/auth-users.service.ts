import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { FindOptions } from '../../commons/types/find-options.type';
import { User, userEntityName } from '../users/entities/user.entity';
import { CreateUserPayload, FindOneAuthUserConditions } from './auth.type';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(
    createUserPayload: CreateUserPayload,
  ): Promise<Partial<User>> {
    const { phoneNumber } = createUserPayload;
    if (!phoneNumber) {
      throw new BadRequestException('Phone number does not exist!');
    }
    const user = this.userRepository.create({ phoneNumber });

    return await this.userRepository.save(user);
  }

  public async findOne(
    findOneAuthUserConditions: FindOneAuthUserConditions,
    findOptions: FindOptions,
  ): Promise<Partial<User> | null> {
    if (_.isEmpty(findOneAuthUserConditions)) {
      return null;
    }
    const { phoneNumber } = findOneAuthUserConditions;
    let query = this.findQuery();
    if (phoneNumber) {
      query = query.andWhere(`${userEntityName}.phoneNumber = :phoneNumber`, {
        phoneNumber,
      });
    }
    query = EntityFactory.getFindQueryByOptions(query, User, findOptions);

    return await query.getOne();
  }

  public async findOneOrFail(
    findOneAuthUserConditions: FindOneAuthUserConditions,
    findOptions: FindOptions,
  ): Promise<Partial<User>> {
    const findResult = await this.findOne(
      findOneAuthUserConditions,
      findOptions,
    );
    if (!findResult) {
      throw new NotFoundException('User not found!');
    }

    return findResult;
  }

  public async findOneById(
    id: string,
    findOptions: FindOptions,
  ): Promise<Partial<User> | null> {
    let query = this.findQuery().where(`${userEntityName}.id = :id`, { id });
    query = EntityFactory.getFindQueryByOptions(query, User, findOptions);

    return await query.getOne();
  }

  public async findOneOrFailById(
    id: string,
    findOptions: FindOptions,
  ): Promise<Partial<User>> {
    const findResult = await this.findOneById(id, findOptions);
    if (!findResult) {
      throw new NotFoundException('User not found!');
    }

    return findResult;
  }

  private findQuery(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder(userEntityName)
      .select(`${userEntityName}.id`);
  }
}
