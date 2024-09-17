import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

    try {
      const plantNeeds = this.plantNeedsRepository.create({
        ...rest,
        plant: plant,
      });

      return await this.plantNeedsRepository.save(plantNeeds);
    } catch (error) {
      throw new InternalServerErrorException('Error saving plant needs');
    }
  }

  async findAll(): Promise<PlantNeeds[]> {
    try {
      return await this.plantNeedsRepository.find({
        relations: ['plant'], // Incluye la relación 'plant'
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching plant needs');
    }
  }

  async findOne(id: number): Promise<PlantNeeds> {
    try {
      const plantNeeds = await this.plantNeedsRepository.findOne({
        where: { id },
        relations: ['plant'], // Incluye la relación 'plant' también para findOne
      });

      if (!plantNeeds) {
        throw new NotFoundException(`Plant needs with id ${id} not found`);
      }

      return plantNeeds;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching plant needs');
    }
  }
}
