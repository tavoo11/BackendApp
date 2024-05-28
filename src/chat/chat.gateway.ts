import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {

  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}
  
  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log('Cliente conectado');

      socket.on('disconnect', ()=> {
        console.log('Cliente desconectado')
      })
    })


  }



  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
