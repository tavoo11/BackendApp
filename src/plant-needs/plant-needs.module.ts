import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantNeedsService } from './plant-needs.service';
import { PlantNeedsController } from './plant-needs.controller';
import { PlantNeeds } from './entities/plant-need.entity';
import { Plant } from '../plant/entities/plant.entity'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [TypeOrmModule.forFeature([PlantNeeds, Plant])],
  controllers: [PlantNeedsController],
  providers: [PlantNeedsService],
  exports: [PlantNeedsService],
})
export class PlantNeedsModule {}
