import { Exclude } from 'class-transformer';
import { Task } from '../tasks/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  task: Task[];
}
