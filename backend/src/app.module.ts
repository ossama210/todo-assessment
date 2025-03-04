import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { TodoModule } from './resources/todo/todo.module';

@Module({
  imports: [TodoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
