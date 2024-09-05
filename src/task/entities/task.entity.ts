import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => User, user => user.tasks, { nullable: false, eager: true })
  @JoinColumn({ name: 'userId' })  // Se asegura de que se almacene como una columna separada
  user: User;

  @ManyToOne(() => Plant, plant => plant.tasks, { nullable: true, eager: true })
  @JoinColumn({ name: 'plantId' })
  plant: Plant;
}
