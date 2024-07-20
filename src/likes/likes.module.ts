import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../post/entities/post.entity'; // Importa la entidad Post
import { UsersModule } from '../users/users.module';
import { PostModule } from '../post/post.module'; // Importa el módulo de Posts

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, User, Post]), // Añade Post al TypeOrmModule
    UsersModule,
    PostModule // Asegúrate de importar el módulo de Posts aquí
  ],
  providers: [LikesService],
  controllers: [LikesController]
})
export class LikesModule {}
