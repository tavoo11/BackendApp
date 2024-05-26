import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
  ){}

  async createUser(user : CreateUserDto) {

    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
        email: user.email
      }
    })

    if (!userFound){
      const newUser = this.userRepository.create(user)
      return this.userRepository.save(newUser);
      
    }
    
    return new HttpException('El usuario ya existe', HttpStatus.CONFLICT)
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      }
    })

    if (!userFound){
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    return userFound;
  }

  update(id: number, updateUser: UpdateUserDto) {
    return this.userRepository.update({id}, updateUser);
  }

  remove(id: number) {
    return this.userRepository.delete({id});
  }
}
