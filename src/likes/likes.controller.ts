// likes.controller.ts
import { Controller, Post, Delete, Param, Body, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  toggleLike(@Body() createLikeDto: CreateLikeDto): Promise<Like | void> {
    return this.likesService.toggleLike(createLikeDto);
  }

  @Get()
  findAll(): Promise<Like[]> {
    return this.likesService.findAll();
  }

  
}
