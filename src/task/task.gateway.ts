import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from './entities/task.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // Ajusta según tus necesidades de CORS
  },
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string>(); // Mapa para almacenar la relación socketId - userId

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

  // Emitir un evento cuando se cree una tarea
  sendNewTask(task: Task,) {
    this.server.emit('task-created', {task});
  }

  // Emitir un evento cuando se actualice una tarea
  sendUpdatedTask(task: Task) {
    this.server.emit('updatedTask', task);
  }

  // Emitir un evento cuando se elimine una tarea
  sendDeletedTask(taskId: number) {
    this.server.emit('deletedTask', taskId);
  }

  // Nueva función para enviar una tarea a un usuario conectado
  sendTaskToUser(userId: number, task: Task) {
    const roomId = `user_${userId}`;
    this.server.to(roomId).emit('task-created', task);
    console.log(`Task sent to user ${userId} in room: ${roomId}`);
  }
}
