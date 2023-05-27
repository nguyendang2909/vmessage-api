import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../commons/entities/base.entity';
import { EntityFactory } from '../../../commons/lib/entity-factory';
import { ERole } from '../../roles/roles.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 300, nullable: false, type: 'varchar' })
  password?: string;

  @Column({ length: 20, nullable: false, type: 'varchar' })
  phoneNumber!: string;

  @Column({ default: ERole.member, enum: ERole, nullable: false, type: 'enum' })
  role!: ERole;

  @Column({ length: 100, nullable: false, type: 'varchar' })
  firstName!: string;

  @Column({ length: 100, nullable: false, type: 'varchar' })
  lastName!: string;

  @Column({ length: 100, nullable: true, type: 'varchar' })
  email?: string;

  @Column({ nullable: true, type: 'timestamp' })
  birthdate?: Date | string;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;
}

export const userEntityName = EntityFactory.getEntityName(User);
