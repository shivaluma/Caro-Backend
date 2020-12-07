import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({
    default: 'user',
  })
  role: 'admin' | 'user';

  @ApiProperty()
  @Column({
    default: null,
  })
  avatar: string | null;

  @ApiProperty()
  @Column({
    default: 1000,
  })
  points: number;

  @ApiProperty()
  @Column({
    default: 0,
  })
  winnum: number;

  @ApiProperty()
  @Column({
    default: 0,
  })
  drawnum: number;

  @ApiProperty()
  @Column({
    default: 0,
  })
  losenum: number;

  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}
