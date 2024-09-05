import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>
  ) {}

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: [
        { username: user.username },
        { email: user.email }
      ]
    });

    if (!userFound) {
      const newUser = this.userRepository.create(user);
      return this.userRepository.save(newUser);
    }
    
    throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
  }

  findAll() {
    return this.userRepository.find(); // Simplificado sin relaciones adicionales
  }

  async findOne(id: number) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const updateResult = await this.userRepository.update({ id }, updateUser);
    if (updateResult.affected === 0) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const deleteResult = await this.userRepository.delete({ id });
    if (deleteResult.affected === 0) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return { deleted: true };
  }
}
