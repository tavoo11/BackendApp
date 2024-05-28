import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: "G$3r9*&a#F^fZ@j!xRkP2wM7sH!mLqtY8@j*L^2!x#hC6fWq$9V&gP1vM#rJz3pB^!d*5R$8zK#jG2w@m&3sF!VqX*H^k9", 
      signOptions: { expiresIn: '1d' }, 
    }),
    TypeOrmModule.forFeature([User]), 
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
