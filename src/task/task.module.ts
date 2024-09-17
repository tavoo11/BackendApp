// task.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plant/entities/plant.entity';
import { NotificationsModule } from '../notifications/notification.module'; // Importa el módulo de notificaciones
import { UsersModule } from '../users/users.module';
import { PlantModule } from '../plant/plant.module';
import { WeatherModule } from '../weather.module';
import { AutoTaskSchedulerService } from './auto-task-scheduler.service';
import { PlantNeedsModule } from '../plant-needs/plant-needs.module';
import { JwtService } from '@nestjs/jwt';
import { PlantNeeds } from 'src/plant-needs/entities/plant-need.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Plant, PlantNeeds]),
    NotificationsModule, // Importa el módulo de notificaciones
    UsersModule,
    PlantModule,
    PlantNeedsModule,
    WeatherModule
  ],
  controllers: [TaskController],
  providers: [TaskService,  AutoTaskSchedulerService, JwtService],
  exports: [TaskService]
})
export class TaskModule {}
