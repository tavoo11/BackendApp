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

  async findAll(): Promise<Post[]> {
    return await this.PostRepository.find({
      relations: ['author'], // Include 'author' in relations
      order: { id: 'DESC' }, // Order by ID in descending order
    });
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

  async getPostHistory(userId: number): Promise<Post[]>{
    return await this.PostRepository.find({
      where: [
        {author: {id: userId}}
      ],
      relations: ['author'],
      order: {id: 'DESC'}
    });
  }
}
