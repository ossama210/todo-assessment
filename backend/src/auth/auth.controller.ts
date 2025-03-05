import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/resources/user/user.service';
import { LoginDto } from 'src/common/types/LoginDto';
import { SignUpDto } from 'src/common/types/SignUpDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    // console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    // console.log(signUpDto);
    const user = await this.userService.create(signUpDto);
    // console.log(user);
    return { user };
  }
}
