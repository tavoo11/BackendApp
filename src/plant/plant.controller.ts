import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post()
  create(@Body() createPlantDto: CreatePlantDto) {
    return this.plantService.createPlant(createPlantDto);
  }

  @Get()
  findAll() {
    return this.plantService.findAll();
  }

  @Get(':tag')
  findOne(@Param('tag') tag: string) {
    return this.plantService.findOneByTag(tag);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantDto: UpdatePlantDto) {
    return this.plantService.update(+id, updatePlantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantService.remove(+id);
  }
}
