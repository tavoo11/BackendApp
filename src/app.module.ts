import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '12345678',
    database: 'challengedb',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
  }), UsersModule, PostModule, ChatModule, AuthModule],
})
export class AppModule {}
