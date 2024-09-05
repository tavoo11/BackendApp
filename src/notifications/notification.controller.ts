// notifications.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('list')
  async getNotifications(@Query('userId') userId: number) {
    return this.notificationsService.getNotifications(userId);
  }

  @Get('unread')
  async getUnreadNotifications(@Query('userId') userId: number) {
    return this.notificationsService.getUnreadNotifications(userId);
  }
}
