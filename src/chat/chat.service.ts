import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = this.chatRepository.create(createChatDto);
    return this.chatRepository.save(newChat);
  }

  async findAll(): Promise<Chat[]> {
    return await this.chatRepository.find({ relations: ['sender', 'receiver'] });
  }

  async findOne(id: number): Promise<Chat> {
    return this.chatRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
  }

  async update(id: number, updateChatDto: UpdateChatDto): Promise<Chat> {
    await this.chatRepository.update(id, updateChatDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.chatRepository.delete(id);
  }

  async getChatHistory(userId1: number, userId2: number): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      relations: ['sender', 'receiver'],
      order: { id: 'ASC' }, // Ordenar los mensajes por ID (o fecha) ascendentemente
    });
  }
}
