import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { Monitoring } from './entities/monitoring.entity';
import { WeatherService } from '../api-meteomatics';
import { HttpModule } from '@nestjs/axios'; // Importa HttpModule aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([Monitoring]),
    HttpModule, // Asegúrate de incluir HttpModule
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService, WeatherService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
