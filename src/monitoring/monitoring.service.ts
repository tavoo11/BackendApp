import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monitoring } from './entities/monitoring.entity';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plant/entities/plant.entity';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(Monitoring)
    private monitoringRepository: Repository<Monitoring>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
  ) {}

  async create(createMonitoringDto: CreateMonitoringDto): Promise<Monitoring> {
    const user = await this.usersRepository.findOne({ where: { id: createMonitoringDto.userId } });
    const plant = await this.plantsRepository.findOne({ where: { id: createMonitoringDto.plantId } });

    if (!user || !plant) {
      throw new Error('User or Plant not found');
    }

    const monitoring = new Monitoring();
    monitoring.user = user;
    monitoring.plant = plant;
    monitoring.observations = createMonitoringDto.observations;
    monitoring.height = createMonitoringDto.height;
    monitoring.healthStatus = createMonitoringDto.healthStatus;
    monitoring.growthStage = createMonitoringDto.growthStage;

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
