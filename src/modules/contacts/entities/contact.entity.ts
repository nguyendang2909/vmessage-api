import { Column, Entity, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';
import { EContactStatus } from '../contacts.enum';

@Entity()
export class Contact extends CommonEntity {
  @Column({ enum: EContactStatus, nullable: false, type: 'varchar' })
  status?: string;

  @ManyToOne(() => User, (user) => user.relatedUsers, { nullable: false })
  friend?: User;

  @ManyToOne(() => User, (user) => user.contacts, { nullable: false })
  user?: User;

  constructor(obj: Partial<Contact>) {
    super();

    Object.assign(this, obj);
  }
}
