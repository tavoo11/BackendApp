// chat.gateway.ts
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(client.id, userId);
      client.join(`user_${userId}`);
      console.log(`User ${userId} connected and joined room user_${userId}`);
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

  @SubscribeMessage('createChat')
  async handleCreateChat(@MessageBody() createChatDto: CreateChatDto): Promise<void> {
    try {
      const message = await this.chatService.createMessage(createChatDto);
      const roomId = `user_${createChatDto.receiverId}`;
      this.server.to(roomId).emit('receiveMessage', message);
      // Emitir una notificación al receptor
      this.server.to(roomId).emit('notification', { message: 'Tienes un nuevo mensaje'});
      console.log('Message sent to room:', roomId);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }
}
