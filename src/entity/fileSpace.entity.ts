import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file_space')
export class FileSpace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  update_time: Date | null;
}