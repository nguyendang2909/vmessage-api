import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  private async getProfile(@CurrentUserId() currentUserId: string) {
    return {
      type: 'profile',
      data: await this.usersService.getProfile(currentUserId),
    };
  }
}
