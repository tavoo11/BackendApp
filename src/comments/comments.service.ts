// comments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = await this.usersRepository.findOne({ where: { id: createCommentDto.userId } });
    const post = await this.postsRepository.findOne({ where: { id: createCommentDto.postId } });

    if (!user || !post) {
      throw new Error('User or Post not found');
    }

    const comment = new Comment();
    comment.user = user;
    comment.post = post;
    comment.content = createCommentDto.content;
    return this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user', 'post'],
    });
  }


  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
