import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Asegúrate de ajustar esto según tu implementación de autenticación

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

 // @UseGuards(JwtAuthGuard) // Asegúrate de ajustar esto según tu implementación de autenticación
  @Get('messages')
  async getMessages(
    @Query('senderId') senderId: number,
    @Query('receiverId') receiverId: number,
  ) {
    return this.chatService.getMessages(senderId);
  }
  
}
