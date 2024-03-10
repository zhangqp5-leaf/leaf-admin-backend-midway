import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('demo_rule')
export class DemoRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column()
  frequency: string;

  @Column()
  target: string;

  @Column()
  template: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @Column()
  type: string;
}