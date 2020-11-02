import { Entity, PrimaryGeneratedColumn, Column, Unique, Generated } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  @Generated("uuid")
  @Unique('integration_id_unique', ['integrationId'])
  integrationId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isOnline: boolean;

  constructor(partial: Partial<User>) {
      Object.assign(this, partial);
  }
}