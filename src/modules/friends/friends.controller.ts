import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { RequestFriendDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FriendsService } from './friends.service';

@Controller('contacts')
@ApiTags('contacts')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  private async requestFriend(
    @Body() requestFriendDto: RequestFriendDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'requestFriend',
      data: await this.friendsService.requestFriend(
        requestFriendDto,
        currentUserId,
      ),
    };
  }

  @Get()
  private async findMany(
    @Query() findManyContactsDto: FindManyContactsDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'findManyContacts',
      // ...(await this.contactsService.findMany(
      //   findManyContactsDto,
      //   currentUserId,
      // )),
    };
  }

  @Get(':id')
  private async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'contact',
      data: await this.friendsService.findOneOrFailById(id, currentUserId),
    };
  }

  @Patch(':id')
  private async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return {
      type: 'updateContact',
      data: await this.friendsService.update(id, updateContactDto),
    };
  }
}
