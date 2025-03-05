import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/resources/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwtConstant';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret || 'anoth3r secret!&1^x',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
