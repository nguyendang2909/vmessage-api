import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { FindMyProfileDto } from './dto/find-my-profile.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { User, userEntityName } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getProfile(findMyProfileDto: FindMyProfileDto, userId: string) {
    const { f } = findMyProfileDto;
    const selectFields = this.selectFields(f);

    const user = this.findQuery()
      .andWhere(`id = :userId`, { userId })
      .addSelect(selectFields)
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found!');
    }

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
