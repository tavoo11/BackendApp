import { Module } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entities/plant.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
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
  controllers: [PlantController],
  providers: [PlantService],
  exports: [TypeOrmModule] 
})
export class PlantModule {}

