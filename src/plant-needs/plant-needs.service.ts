import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlantNeeds } from './entities/plant-need.entity';
import { Plant } from '../plant/entities/plant.entity';
import { CreatePlantNeedsDto } from './dto/create-plant-need.dto';

@Injectable()
export class PlantNeedsService {
  constructor(
    @InjectRepository(PlantNeeds)
    private readonly plantNeedsRepository: Repository<PlantNeeds>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>, // Asegúrate de tener la referencia correcta al repositorio de Plant
  ) {}

  async create(createPlantNeedsDto: CreatePlantNeedsDto): Promise<PlantNeeds> {
    const { plantId, ...rest } = createPlantNeedsDto;

    // Verifica que la planta exista
    const plant = await this.plantRepository.findOneBy({ id: plantId });

    if (!plant) {
      throw new NotFoundException(`Plant with id ${plantId} not found`);
    }

    const plantNeeds = this.plantNeedsRepository.create({
      ...rest,
      plant: plant,
    });

    return this.plantNeedsRepository.save(plantNeeds);
  }

  async findAll(): Promise<PlantNeeds[]> {
    return this.plantNeedsRepository.find({
      relations: ['plant'], // Incluye la relación 'plant'
    });
  }
  
  async findOne(id: number): Promise<PlantNeeds> {
    return this.plantNeedsRepository.findOne({
      where: { id },
      relations: ['plant'], // Incluye la relación 'plant' también para findOne
    });
  }
  
}
