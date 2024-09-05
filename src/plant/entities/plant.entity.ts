import { PlantNeeds } from '../../plant-needs/entities/plant-need.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tag: string;  // El identificador alfanumérico único de la planta

  @Column()
  species: string;  // Especie de la planta

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  germinationDate: Date;  // Fecha de germinación

  @Column({ nullable: true })
  initialConditions: string;  // Condiciones iniciales de crecimiento

  @Column({ nullable: true })
  growthStage: string;  // Etapa actual de crecimiento de la planta

  @Column({ nullable: true })
  healthStatus: string;  // Estado de salud de la planta

  @OneToMany(() => PlantNeeds, needs => needs.plant)
  needs: PlantNeeds[];

  @OneToMany(() => Task, task => task.plant)
  tasks: Task[];
}
