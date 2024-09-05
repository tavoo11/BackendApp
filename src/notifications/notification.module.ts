// notifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notification.service';
import { NotificationsGateway } from './notification.gateway';
import { Notification } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule
  ],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
