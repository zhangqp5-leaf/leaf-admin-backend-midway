import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  headImg: string;

  @Column()
  nickname: string;
}