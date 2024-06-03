import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}
  
  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);
  }

  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDto: CreateChatDto) {
    const message = await this.chatService.create(createChatDto);
    this.server.emit('receiveMessage', message);  // Emitir mensaje a todos los clientes conectados
    return message;
  }

  @SubscribeMessage('findAllChat')
  async findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  async findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('removeChat')
  async remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
