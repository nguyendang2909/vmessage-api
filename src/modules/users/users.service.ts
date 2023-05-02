import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { User, userEntityName } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getProfile(userId: string) {
    const user = this.userRepository
      .createQueryBuilder(userEntityName)
      .andWhere(`${userEntityName}.id = :userId`, { userId })
      .getOne();

    return user;
  }

  // private findQuery(): SelectQueryBuilder<User> {
  //   return this.userRepository
  //     .createQueryBuilder(userEntityName)
  //     .select(`${userEntityName}.id`);
  // }
}
