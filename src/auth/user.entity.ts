import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as argon2 from 'argon2';
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    default: 'user',
  })
  role: 'admin' | 'user';

  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}
