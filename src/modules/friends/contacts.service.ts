import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EContactStatus } from './contacts.constant';
import { RequestFriendDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { FindOneContactByIdDto } from './dto/find-one-contact-by-id.dto';
import { UpdateContactStatusDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly usersService: UsersService,
  ) {}

  public async requestFriend(
    requestFriendDto: RequestFriendDto,
    currentUserId: string,
  ) {
    const { targetUserId } = requestFriendDto;
    await this.usersService.findOneOrFailById(
      targetUserId,
      { f: ['id'] },
      currentUserId,
    );
    const currentUser = new User({ id: currentUserId });
    const friendUser = new User({ id: targetUserId });
    const existRelationship = await this.contactRepository.findOne({
      where: [
        {
          userOne: currentUser,
          userTwo: friendUser,
        },
        {
          userOne: friendUser,
          userTwo: currentUser,
        },
      ],
      select: ['id', 'status', 'requester'],
    });
    if (!existRelationship) {
      return await this.contactRepository.save({
        userOne: currentUser,
        userTwo: friendUser,
        requester: currentUser,
      });
    }
    const { status, requester, userOne, userTwo } = existRelationship;
    switch (status) {
      case EContactStatus.pending:
        if (requester === targetUserId) {
          return await this.contactRepository.save({
            id: existRelationship.id,
            status: EContactStatus.accepted,
          });
        }
        return existRelationship;
      case EContactStatus.accepted:
        throw new BadRequestException({
          message: 'Your already were friend!',
          errorCode: 'ALREADY_FRIEND',
        });
      case EContactStatus.blocked:
        throw new BadRequestException({
          message: 'User is not available!',
          errorCode: 'USER_NOT_AVAILABLE',
        });
    }

    // if (existContact && existContact.status) {
    //   const { status: contactStatus } = existContact;
    //   if (contactStatus) {
    //     if (contactStatus === EContactStatus.blocked) {
    //       throw new ForbiddenException('You have been banned from user!');
    //     }
    //     if (contactStatus === EContactStatus.friend) {
    //       throw new BadRequestException('You have been friend!');
    //     }
    //   }
    // }
    // const existContactFromFriend = await this.contactRepository.findOne({
    //   where: {
    //     user: new User({ id: friendId }),
    //     friend: new User({ id: currentUserId }),
    //   },
    //   select: ['id', 'status'],
    // });
    // if (existContactFromFriend && existContactFromFriend.status) {
    // }
    // const contact = new Contact({
    //   user: new User({ id: currentUserId }),
    //   friend: new User({ id: friendId }),
    // });
    // const createContact = await this.contactRepository.save(contact);

    // return createContact;
  }

  public async findMany(
    findManyContactsDto: FindManyContactsDto,
    currentUserId: string,
  ) {
    const { status, cursor, f } = findManyContactsDto;
    // const findResult = await this.contactRepository.find({
    //   where: {
    //     user: new User({ id: currentUserId }),
    //     ...(status ? { status } : {}),
    //     ...(cursor ? { id: MoreThan(cursor) } : {}),
    //   },
    //   order: {
    //     updatedAt: -1,
    //   },
    //   take: 50,
    //   select: EntityFactory.getSelectFieldsAsObj(f),
    // });

    // return {
    //   data: findResult,
    //   pagination: {
    //     cursor: EntityFactory.getCursor(findResult),
    //   },
    // };
  }

  public async findOneById(
    id: string,
    findOneContactByIdDto: FindOneContactByIdDto,
    currentUserId: string,
  ) {
    const { f } = findOneContactByIdDto;
    return await this.contactRepository.findOne({
      where: [
        {
          id,
          userOne: {
            id: currentUserId,
          },
        },
        {
          id,
          userTwo: {
            id: currentUserId,
          },
        },
      ],
      select: EntityFactory.getSelectFieldsAsObj(f),
    });
  }

  public async findOneOrFailById(
    id: string,
    findOneContactByIdDto: FindOneContactByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOneById(
      id,
      findOneContactByIdDto,
      currentUserId,
    );
    if (!findResult) {
      throw new BadRequestException('Contact not found!');
    }
    return findResult;
  }

  public async updateStatus(
    id: string,
    updateContactStatusDto: UpdateContactStatusDto,
    currentUserId: string,
  ) {
    const existContact = await this.findOneOrFailById(
      id,
      {
        f: ['id', 'status', 'requester'],
      },
      currentUserId,
    );
    const {
      id: existContactId,
      status: existContactStatus,
      requester: existRequester,
    } = existContact;
    const requesterId = existRequester?.id;
    if (!existContactId && !existContactStatus && !requesterId) {
      throw new BadRequestException();
    }
    if (requesterId === currentUserId) {
    }
    const { status } = updateContactStatusDto;
    if (status === EContactStatus.blocked) {
    }
    const updateResult = await this.contactRepository.update(
      { id },
      {
        ...(status ? { status } : {}),
      },
    );

    return !!updateResult.affected;
  }
}
