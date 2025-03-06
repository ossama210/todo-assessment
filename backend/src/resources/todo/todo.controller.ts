import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createTodoDto: Prisma.TodoUncheckedCreateInput,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.todoService.create(userId, createTodoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.todoService.findAll(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateTodoDto: Prisma.TodoUpdateInput,
  ) {
    const userId = req.user.id;
    return this.todoService.update(userId, +id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.todoService.remove(+id, userId);
  }
}
