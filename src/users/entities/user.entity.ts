import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Notification } from '../../notifications/entities/notification.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  birthDate: Date;

  @Column({ nullable: true })
  profilePhotoUrl: string;

  @Column({ default: 'worker' }) // Rol del trabajador, por defecto 'worker'
  role: string;

  @Column({ nullable: true })
  position: string; // Posición específica en el vivero

  @Column({ nullable: true })
  phoneNumber: string; // Número de teléfono del trabajador

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];  

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}