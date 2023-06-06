import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ERole, EUserStatus } from '../../users/users.enum';
import { EncryptionsService } from '../encryptions.service';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encryptionsService: EncryptionsService,
  ) {}

  private readonly logger = new Logger(AuthAdminService.name);

  private async onApplicationBootstrap() {
    try {
      const phoneNumber = '+84971016191';
      const existAdminUser = await this.userRepository.findOne({
        where: {
          phoneNumber,
        },
      });

      if (!existAdminUser && process.env.ADMIN_PASSWORD) {
        const adminUser = new User({
          phoneNumber,
          password: this.encryptionsService.hash(process.env.ADMIN_PASSWORD),
          firstName: 'Nguyen Dang',
          lastName: 'Quynh',
          role: ERole.admin,
          status: EUserStatus.activated,
        });

        await this.userRepository.save(adminUser);
      }
    } catch (err) {
      this.logger.log(err);
    }
  }
}
