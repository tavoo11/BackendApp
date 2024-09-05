// controller: plant-needs.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PlantNeedsService } from './plant-needs.service';
import { CreatePlantNeedsDto } from './dto/create-plant-need.dto';

@Controller('plant-needs')
export class PlantNeedsController {
  constructor(private readonly plantNeedsService: PlantNeedsService) {}

  @Post()
  create(@Body() createPlantNeedsDto: CreatePlantNeedsDto) {
    return this.plantNeedsService.create(createPlantNeedsDto);
  }

  @Get()
  async findAll() {
    const needs = await this.plantNeedsService.findAll();
    // Transformar la respuesta para incluir solo el 'plantId'
    return needs.map(need => ({
      ...need,
      plantId: need.plant.id
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const need = await this.plantNeedsService.findOne(id);
    // Transformar la respuesta para incluir solo el 'plantId'
    return {
      ...need,
      plantId: need.plant.id
    };
  }
}
