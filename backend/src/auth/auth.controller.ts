import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/resources/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
}
