import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { TodoModule } from './resources/todo/todo.module';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TodoModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
