import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file_space_list')
export class FileSpaceList {
  @Column()
  classify_id: number;

  @Column()
  file_id: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
}