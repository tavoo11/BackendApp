import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plant } from './entities/plant.entity';
import { Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
  ) {}

  createPlant(createPlantDto: CreatePlantDto) {
    const newPlant = this.plantRepository.create(createPlantDto);
    return this.plantRepository.save(newPlant);
  }

  async findAll(): Promise<Plant[]> {
    return await this.plantRepository.find({
      order: { id: 'DESC' }, // Ordenar por ID en orden descendente
    });
  }

  async findOneByTag(tag: string): Promise<Plant> {
    const plantFound = await this.plantRepository.findOne({
      where: { tag },
    });
    if (!plantFound)
      throw new HttpException('Planta no encontrada', HttpStatus.NOT_FOUND);
    return plantFound;
  }

  update(id: number, updatePlantDto: UpdatePlantDto) {
    return this.plantRepository.update(id, updatePlantDto);
  }

  async remove(id: number) {
    return await this.plantRepository.delete(id);
  }
}
