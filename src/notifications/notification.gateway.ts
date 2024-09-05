import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string>(); // Map to store socketId to userId mapping

  constructor(private readonly notificationsService: NotificationsService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(client.id, userId);
      client.join(`user_${userId}`);
      console.log(`User ${userId} connected and joined room user_${userId}`);

      // Enviar notificaciones no leídas
      const unreadNotifications = await this.notificationsService.getUnreadNotifications(parseInt(userId));
      if (unreadNotifications.length > 0) {
        this.server.to(`user_${userId}`).emit('unreadNotifications', unreadNotifications);
      }
    } else {
      console.log('User undefined connected');
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.activeUsers.get(client.id);
    if (userId) {
      client.leave(`user_${userId}`);
      this.activeUsers.delete(client.id);
      console.log(`User ${userId} disconnected and left room user_${userId}`);
    } else {
      console.log('User undefined disconnected');
    }
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(@MessageBody() createNotificationDto: CreateNotificationDto): Promise<void> {
    try {
      const notification = await this.notificationsService.createNotification(createNotificationDto);
      const roomId = `user_${createNotificationDto.userId}`;
      this.server.to(roomId).emit('receiveNotification', notification);
      console.log('Notification sent to room:', roomId);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  @SubscribeMessage('markNotificationsAsRead')
  async handleMarkNotificationsAsRead(@MessageBody() userId: number): Promise<void> {
    await this.notificationsService.markNotificationsAsRead(userId);
  }

  // Nueva función para enviar notificación a un usuario conectado
  sendNotificationToUser(userId: number, message: string) {
    const roomId = `user_${userId}`;
    this.server.to(roomId).emit('receiveNotification', { message });
    console.log(`Notification sent to user ${userId} in room: ${roomId}`);
  }
}
