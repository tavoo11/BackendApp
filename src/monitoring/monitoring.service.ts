import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monitoring } from './entities/monitoring.entity';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plant/entities/plant.entity';
import { WeatherService } from 'src/api-meteomatics';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(Monitoring)
    private readonly monitoringRepository: Repository<Monitoring>,
    private readonly weatherService: WeatherService,
  ) {}

  async createMonitoring(plantId: number, userId: number, observations: string): Promise<Monitoring> {
    const weatherData = await this.weatherService.getCurrentWeather();

    const temperature = weatherData.data.find(d => d.parameter === 't_2m:C')?.coordinates[0]?.dates[0]?.value || null;
    const precipitation = weatherData.data.find(d => d.parameter === 'precip_1h:mm')?.coordinates[0]?.dates[0]?.value || null;
    const windSpeed = weatherData.data.find(d => d.parameter === 'wind_speed_10m:ms')?.coordinates[0]?.dates[0]?.value || null;
    const humidity = weatherData.data.find(d => d.parameter === 'relative_humidity_2m:p')?.coordinates[0]?.dates[0]?.value || null;

    const monitoring = this.monitoringRepository.create({
      plant: { id: plantId },
      user: { id: userId },
      observations,
      temperature,
      precipitation,
      windSpeed,
      humidity,
    });

    return this.monitoringRepository.save(monitoring);
  }


  async findAll(): Promise<Monitoring[]> {
    return this.monitoringRepository.find({
      relations: ['user', 'plant'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.monitoringRepository.delete(id);
  }
}
