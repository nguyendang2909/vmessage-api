import { Entity, JoinTable, ManyToMany } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Room extends CommonEntity {
  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  users!: User[];

  constructor(obj: Partial<Room>) {
    super();

    Object.assign(this, obj);
  }
}
