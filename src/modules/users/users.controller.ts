import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { FindMyProfileDto } from './dto/find-my-profile.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  private async getProfile(
    @Query() findMyProfileDto: FindMyProfileDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'profile',
      data: await this.usersService.getProfile(findMyProfileDto, currentUserId),
    };
  }

  @Patch('/profile')
  private async updateProfile(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'updateProfile',
      data: await this.usersService.updateProfile(
        updateMyProfileDto,
        currentUserId,
      ),
    };
  }
}
