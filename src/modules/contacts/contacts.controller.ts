import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
@ApiTags('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  private async create(
    @Body() createContactDto: CreateContactDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'createContact',
      data: await this.contactsService.create(createContactDto, currentUserId),
    };
  }

  @Get()
  private async findMany(
    @Query() findManyContactsDto: FindManyContactsDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'findManyContacts',
      ...(await this.contactsService.findMany(
        findManyContactsDto,
        currentUserId,
      )),
    };
  }

  @Get(':id')
  private async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'contact',
      data: await this.contactsService.findOneOrFailById(id, currentUserId),
    };
  }

  @Patch(':id')
  private async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return {
      type: 'updateContact',
      data: await this.contactsService.update(id, updateContactDto),
    };
  }

  @Delete(':id')
  private async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'removeContact',
      data: await this.contactsService.remove(id, currentUserId),
    };
  }
}
