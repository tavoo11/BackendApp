import { Controller, Get, Post, Body, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PlantNeedsService } from './plant-needs.service';
import { CreatePlantNeedsDto } from './dto/create-plant-need.dto';

@Controller('plant-needs')
export class PlantNeedsController {
  constructor(private readonly plantNeedsService: PlantNeedsService) {}

  @Post()
  async create(@Body() createPlantNeedsDto: CreatePlantNeedsDto) {
    try {
      return await this.plantNeedsService.create(createPlantNeedsDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating plant needs');
    }
  }

  @Get()
  async findAll() {
    try {
      const needs = await this.plantNeedsService.findAll();
      // Transformar la respuesta para incluir solo el 'plantId'
      return needs.map(need => ({
        ...need,
        plantId: need.plant.id
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error fetching plant needs');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const need = await this.plantNeedsService.findOne(id);
      // Transformar la respuesta para incluir solo el 'plantId'
      return {
        ...need,
        plantId: need.plant.id
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching plant needs');
    }
  }
}
