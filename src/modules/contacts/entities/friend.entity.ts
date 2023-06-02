import { Column, Entity, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';
import { EFriendStatus } from '../friends.enum';

@Entity()
export class Friend extends CommonEntity {
  @ManyToOne(() => User, { nullable: false })
  friendOne?: User;

  @ManyToOne(() => User, { nullable: false })
  friendTwo?: User;

  @ManyToOne(() => User, { nullable: true })
  requester: User;

  @Column({ enum: EFriendStatus, nullable: false, type: 'smallint' })
  status?: EFriendStatus;

  constructor(obj: Partial<Friend>) {
    super();
    Object.assign(this, obj);
  }
}
