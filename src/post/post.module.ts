import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({
      storage: diskStorage({
        destination : './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const exit = file.mimetype.split('/')[1];
          callback(null, `${file.fieldname}-${uniqueSuffix}.${exit}`);
        }
      })
    })
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule] 
})
export class PostModule {}

