import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post()
  create(@Body() createMonitoringDto: CreateMonitoringDto) {
    const { plantId, userId, observations } = createMonitoringDto;
    return this.monitoringService.createMonitoring(plantId, userId, observations);
  }

  @Get()
  findAll() {
    return this.monitoringService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.monitoringService.remove(id);
  }
}
