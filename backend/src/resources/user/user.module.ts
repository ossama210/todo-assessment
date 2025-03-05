import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [],
  providers: [UserService, PrismaService],
})
export class UserModule {}
