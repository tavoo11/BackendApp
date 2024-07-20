import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string; // Token JWT

  @OneToOne(() => User)
  @JoinColumn()
  user: User; // Relación con la entidad de usuarios
}

