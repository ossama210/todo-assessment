import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createTodoDto: Prisma.TodoUncheckedCreateInput) {
    return this.prisma.todo.create({
      data: { ...createTodoDto, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: [
        {
          date: 'desc',
        },
        {
          priority: 'desc',
        },
      ],
    });
  }

  update(
    userId: number,
    todoId: number,
    updateTodoDto: Prisma.TodoUpdateInput,
  ) {
    return this.prisma.todo.update({
      where: { userId, id: todoId },
      data: updateTodoDto,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.todo.delete({ where: { id, userId } });
  }
}
