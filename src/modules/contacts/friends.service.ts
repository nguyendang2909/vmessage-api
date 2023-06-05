import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RequestFriendDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Friend } from './entities/friend.entity';
import { EFriendStatus } from './friends.enum';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly contactRepository: Repository<Friend>,
    private readonly usersService: UsersService,
  ) {}

  public async requestFriend(
    requestFriendDto: RequestFriendDto,
    currentUserId: string,
  ) {
    const { friendId } = requestFriendDto;
    // TODO: Check exist friend user
    await this.usersService.findOneOrFailById(
      friendId,
      { f: ['id'] },
      currentUserId,
    );
    const currentUser = new User({ id: currentUserId });
    const friendUser = new User({ id: friendId });
    const existRelationship = await this.contactRepository.findOne({
      where: [
        {
          friendOne: currentUser,
          friendTwo: friendUser,
        },
        {
          friendOne: friendUser,
          friendTwo: currentUser,
        },
      ],
      select: ['id', 'status', 'requester'],
    });
    if (!existRelationship) {
      return await this.contactRepository.save({
        friendOne: currentUser,
        friendTwo: friendUser,
        requester: currentUser,
      });
    }
    const { status, requester } = existRelationship;
    if (status === EFriendStatus.pending) {
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

  public async findOneById(id: string, currentUserId: string) {
    // return await this.contactRepository.findOne({
    //   where: { id, user: new User({ id: currentUserId }) },
    // });
  }

  public async findOneOrFailById(id: string, currentUserId: string) {
    // const findResult = await this.findOneById(id, currentUserId);
    // if (!findResult) {
    //   throw new BadRequestException('Contact not found!');
    // }
    // return findResult;
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
}
