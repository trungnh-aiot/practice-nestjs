import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'done';

  @CreateDateColumn()
  createdAt: Date;
  @Column({ nullable: true })
  file?: string;
}
