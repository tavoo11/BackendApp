import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';
//import { ChatGateway } from './chat.gateway'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //private chatGateway: ChatGateway, // Inyecta el ChatGateway
  ) {}

  async createMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { content, senderId, receiverId } = createChatDto;

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });


    console.log('Sender:', sender); // Agregar esta línea para debug
    console.log('Receiver:', receiver); // Agregar esta línea para debug

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = this.chatRepository.create({
      content,
      sender,
      receiver,
    });

    await this.chatRepository.save(message);

     // Emitir el mensaje al ChatGateway
     //this.chatGateway.handleCreateChat(message);

    return message;
  }
}
