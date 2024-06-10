import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { content, senderId, receiverId } = createChatDto;

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = this.chatRepository.create({
      content,
      sender,
      receiver,
    });

    await this.chatRepository.save(message);
    return message;
  }

  async getMessages(userId: number): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [
        { sender: { id: userId } },
        { receiver: { id: userId } }
      ],
      relations: ['sender', 'receiver'],
    });
  }
}
