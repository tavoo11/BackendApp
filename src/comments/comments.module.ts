import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../post/entities/post.entity'; 
import { UsersModule } from 'src/users/users.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post]),
  UsersModule,
  PostModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
