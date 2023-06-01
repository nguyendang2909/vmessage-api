import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { FindMyProfileDto } from './dto/find-my-profile.dto';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { FindOneUserDto } from './dto/is-exist-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { User, userEntityName } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findOne(
    findOneUserDto: FindOneUserDto,
    currentUserId: string,
  ): Promise<Partial<User> | null> {
    const { phoneNumber, f } = findOneUserDto;
    if (!phoneNumber) {
      return null;
    }
    const findResult = await this.userRepository.findOne({
      where: {
        ...(phoneNumber ? { phoneNumber } : {}),
      },
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return findResult;
  }

  public async findOneOrFail(
    findOneUserDto: FindOneUserDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOne(findOneUserDto, currentUserId);
    if (!findResult) {
      throw new BadRequestException('User not found!');
    }

    return findResult;
  }

  public async findOneById(
    id: string,
    findOneUserByIdDto: FindOneUserByIdDto,
    currentUserId: string,
  ) {
    const { f } = findOneUserByIdDto;
    const findResult = await this.userRepository.findOne({
      where: {
        id,
      },
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return findResult;
  }

  public async findOneOrFailById(
    id: string,
    findOneUserByIdDto: FindOneUserByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOneById(
      id,
      findOneUserByIdDto,
      currentUserId,
    );
    if (!findResult) {
      throw new BadRequestException('User not found!');
    }

    return findResult;
  }

  public async getProfile(
    findMyProfileDto: FindMyProfileDto,
    currentUserId: string,
  ) {
    const { f } = findMyProfileDto;
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return user;
  }

  public async updateProfile(
    updateMyProfileDto: UpdateMyProfileDto,
    currentUserId: string,
  ) {
    const { birthDate, gender } = updateMyProfileDto;
    const updateOptions = {
      ...(birthDate ? { birthDate } : {}),
      ...(gender ? { gender } : {}),
    };
    const updateResult = await this.userRepository.update(
      { id: currentUserId },
      updateOptions,
    );
    return Boolean(updateResult.affected);
  }

  private findQuery(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder(userEntityName)
      .select(`${userEntityName}.id`);
  }

  private selectFields(fields: string[]) {
    return EntityFactory.getSelectFields(fields, userEntityName).filter(
      (item) => item !== 'password',
    );
  }
}
