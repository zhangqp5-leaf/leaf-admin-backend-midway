import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('demo_user')
export class DemoUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nick_name: string;

  @Column()
  gender: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
}