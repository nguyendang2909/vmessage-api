import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  public async create(
    createContactDto: CreateContactDto,
    currentUserId: string,
  ): Promise<Partial<Contact>> {
    const { friendId } = createContactDto;
    const existContact = await this.contactRepository.findOne({
      where: {
        user: new User({ id: currentUserId }),
        friend: new User({ id: friendId }),
      },
      select: ['id'],
    });
    if (existContact) {
      throw new BadRequestException();
    }
    const contact = new Contact({
      user: new User({ id: currentUserId }),
      friend: new User({ id: friendId }),
    });
    const createContact = await this.contactRepository.save(contact);

    return createContact;
  }

  public async findMany(
    findManyContactsDto: FindManyContactsDto,
    currentUserId: string,
  ) {
    const { status, cursor, f } = findManyContactsDto;
    const findResult = await this.contactRepository.find({
      where: {
        user: new User({ id: currentUserId }),
        ...(status ? { status } : {}),
        ...(cursor ? { id: MoreThan(cursor) } : {}),
      },
      order: {
        updatedAt: -1,
      },
      take: 50,
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  public async findOneById(id: string, currentUserId: string) {
    return await this.contactRepository.findOne({
      where: { id, user: new User({ id: currentUserId }) },
    });
  }

  public async findOneOrFailById(id: string, currentUserId: string) {
    const findResult = await this.findOneById(id, currentUserId);
    if (!findResult) {
      throw new BadRequestException('Contact not found!');
    }

    return findResult;
  }

  public async update(id: string, updateContactDto: UpdateContactDto) {
    const { status } = updateContactDto;
    const updateResult = await this.contactRepository.update(
      {
        id,
      },
      {
        ...(status ? { status } : {}),
      },
    );

    return !!updateResult.affected;
  }

  public async remove(id: string, currentUserId: string) {
    const removeResult = await this.contactRepository.softDelete({
      id,
      user: new User({ id: currentUserId }),
    });

    return !!removeResult.affected;
  }
}
