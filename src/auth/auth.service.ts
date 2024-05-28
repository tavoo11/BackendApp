import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usuariosRepository: Repository<User>,
  ) {}

  async validateUser({ username, password }: CreateAuthDto) {
    const user = await this.usuariosRepository.findOne({ where: { username } });
    if (!user) return new HttpException('usuario no encontrado', HttpStatus.NOT_FOUND);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return this.jwtService.signAsync({ userId: user.id, username: user.username });
    }
    return new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED);
  }
}
