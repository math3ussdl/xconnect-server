import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IUserLogin, User } from '../../../app/models/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async validate(user: IUserLogin): Promise<User> {
    return await this.userService.readByEmail(user.email);
  }

  public async login(user: IUserLogin): Promise<any | { status: number }> {
    return this.validate(user).then(async userData => {
      if (!userData) {
        return { status: 404 };
      }

      const passwordsMatching = await bcrypt.compare(
        user.password,
        userData.password,
      );

      if (!passwordsMatching) {
        throw new BadRequestException('Passwords not Matching!');
      }

      let payload = `${userData.name}${userData.id}`;
      const accessToken = this.jwtService.sign(payload);

      return {
        expires_in: 3600,
        access_token: accessToken,
        user_id: payload,
        status: 200,
      };
    });
  }

  public async register(user: User): Promise<User> {
    return this.userService.create(user);
  }
}
