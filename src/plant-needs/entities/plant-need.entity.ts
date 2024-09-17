// entitie: plant-need.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity'; // Asegúrate de que la ruta sea correcta
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class PlantNeeds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  waterRequirement: number; // en litros por semana o por riego

  @Column()
  minTemperature: number; // temperatura mínima en grados Celsius

  @Column()
  maxTemperature: number; // temperatura máxima en grados Celsius

  @Column()
  humidityRequirement: number; // requisito de humedad en porcentaje

  @Column()
  minLight: number; // luz mínima requerida en horas por día

  @Column()
  maxLight: number; // luz máxima tolerada en horas por día

  @Column()
  minWindSpeed: number; // velocidad mínima del viento en km/h

  @Column()
  maxWindSpeed: number; // velocidad máxima del viento en km/h

  @Column()
  maxPrecipitation: number; // precipitación máxima tolerada en mm

  @ManyToOne(() => Plant, (plant) => plant.needs, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plantId' }) // Añade esta línea
  plant: Plant;

  @OneToMany(() => Task, task => task.plant)
  tasks: Task[];
}
