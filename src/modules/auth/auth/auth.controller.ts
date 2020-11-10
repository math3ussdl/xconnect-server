import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUserLogin, User } from '../../../app/models/user.entity';
import { UserService } from '../user/user.service';
import { MailService } from '@sendgrid/mail';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  async login(@Body() user: IUserLogin): Promise<any> {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: User): Promise<any> {
    const userTarget = await this.userService.readByEmail(user.email);

    if (!userTarget) {
      await this.mailService.send({
        to: user.email,
        from: 'limabrot879@gmail.com',
        subject: 'Bem-Vindo à XConnect',
        text: 'sua plataforma de doação de produtos de informática',
        html: `
          <strong>
            Entre com as credênciais que você cadastrou! <br />
            <em>E-mail</em>: ${user.email} <br />
            <em>Senha</em>: A que você informou no ato de cadastro <br />
          </strong>
          <em>OBS: Não se preocupe!</em> A VulkanSoft não tem acesso a sua senha. :)
        `,
      });

      return this.authService.register(user);
    } else {
      throw new BadRequestException('User Already Exists');
    }
  }
}
