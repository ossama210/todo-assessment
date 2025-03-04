import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  create(createTodoDto: Prisma.TodoCreateInput) {
    return this.prisma.todo.create({
      data: createTodoDto,
    });
  }

  findAll() {
    return this.prisma.todo.findMany();
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  update(
    where: Prisma.TodoWhereUniqueInput,
    updateTodoDto: Prisma.TodoUpdateInput,
  ) {
    return this.prisma.todo.update({ where, data: updateTodoDto });
  }

  remove(id: number) {
    return this.prisma.todo.delete({ where: { id } });
  }
}
