import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERole } from '../../roles/roles.enum';
import { User } from '../../users/entities/user.entity';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { EncryptionsService } from '../encryptions.service';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encryptionsService: EncryptionsService,
  ) {}

  private readonly logger = new Logger(AuthAdminService.name);

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}