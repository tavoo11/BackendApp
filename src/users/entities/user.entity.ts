// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string; // Nombre

  @Column({ nullable: true })
  lastName: string; // Apellidos

  @Column()
  birthDate: Date; // Fecha de nacimiento

  @Column({ nullable: true })
  profilePhotoUrl: string; // URL de la foto de perfil

  @OneToMany(() => Post, post => post.author) // Relación uno a muchos con las publicaciones
  posts: Post[]; // Propiedad para almacenar las publicaciones del usuario

  @OneToMany(() => Chat, chat => chat.sender) // Relación uno a muchos con los mensajes enviados
  sentMessages: Chat[];

  @OneToMany(() => Chat, chat => chat.receiver) // Relación uno a muchos con los mensajes recibidos
  receivedMessages: Chat[];
}

