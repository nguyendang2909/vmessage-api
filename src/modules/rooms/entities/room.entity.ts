import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Room extends CommonEntity {
  @Column({ nullable: true, type: String })
  title?: string;

  @ManyToMany(() => User)
  @JoinTable()
  users?: User[];

  constructor(obj: Partial<Room>) {
    super();
    Object.assign(this, obj);
  }
}
