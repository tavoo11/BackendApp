import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { Monitoring } from './entities/monitoring.entity';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plant/entities/plant.entity'; 
import { UsersModule } from 'src/users/users.module';
import { PlantModule } from '../plant/plant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Monitoring, User, Plant]),
  UsersModule,
  PlantModule],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
