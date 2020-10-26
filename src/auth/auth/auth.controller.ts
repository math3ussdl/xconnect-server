import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUserLogin, User } from '../../app/models/user.entity';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() userData: IUserLogin): Promise<any> {
    const user = await this.userService.readByEmail(userData.email);

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: User): Promise<any> {
    const userTarget = await this.userService.readByEmail(user.email);

    if (!userTarget) {
      return this.authService.register(user);
    } else {
      throw new BadRequestException('User Already Exists');
    }
  }
}
