import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async toggleLike(createLikeDto: CreateLikeDto): Promise<Like | void> {
    const user = await this.usersRepository.findOne({ where: { id: createLikeDto.userId } });
    const post = await this.postsRepository.findOne({ where: { id: createLikeDto.postId } });

    if (!user || !post) {
      throw new Error('User or Post not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        user: { id: createLikeDto.userId },
        post: { id: createLikeDto.postId }
      }
    });

    if (existingLike) {
      await this.likesRepository.delete(existingLike.id);
      return;
    }

    const like = new Like();
    like.user = user;
    like.post = post;

    return this.likesRepository.save(like);
  }

  async findAll(): Promise<Like[]> {
    return this.likesRepository.find({ relations: ['user', 'post'] });
  }
}
