import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  email!: string;

  @Property({ nullable: true })
  name?: string;

  @Property()
  username!: string;

  @Property()
  provider!: string;

  @Property()
  providerId!: string;

  @Property({ nullable: true })
  avatarUrl?: string;

  @Enum({ default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;
}
