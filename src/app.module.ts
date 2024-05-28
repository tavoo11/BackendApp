import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          database: require('../ormconfig.json'),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database'),
    }),
    UsersModule,
    PostModule,
    ChatModule,
    AuthModule,
  ],
})
export class AppModule {}
