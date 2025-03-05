import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { TodoModule } from './resources/todo/todo.module';
import { UserModule } from './resources/user/user.module';

@Module({
  imports: [TodoModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
