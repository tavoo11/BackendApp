import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PlantModule } from './plant/plant.module';
import { NotificationsModule } from './notifications/notification.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PlantNeedsModule } from './plant-needs/plant-needs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          database: require('../ormconfig.json'),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database'),
    }),
    UsersModule,
    PlantModule,
    NotificationsModule,
    AuthModule,
    TaskModule,
    MonitoringModule,
    PlantNeedsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
