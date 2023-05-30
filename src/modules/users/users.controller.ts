import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { FindMyProfileDto } from './dto/find-my-profile.dto';
import { IsExistUserDto } from './dto/is-exist-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/exist')
  @IsPublicEndpoint()
  private async isExistUser(@Body() isExistUserDto: IsExistUserDto) {
    return {
      type: 'isExistUser',
      data: {
        ...isExistUserDto,
        exist: await this.usersService.isExistUser(isExistUserDto),
      },
    };
  }

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
