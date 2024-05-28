import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private PostRepository : Repository<Post>
  ){}

  createPost(post: CreatePostDto) {
    const newPost = this.PostRepository.create(post)
    return this.PostRepository.save(newPost);
  }

  async findAll() {
    return  await this.PostRepository.find();
  }

  async findOne(type: 'text' | 'image' | 'video') {
    const postFound = await this.PostRepository.findOne({
      where:{
        type
      }
    })
    if (!postFound) throw new HttpException('Post no encontrado', HttpStatus.NOT_FOUND)
    return postFound;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return await this.PostRepository.delete(id);
  }
}
