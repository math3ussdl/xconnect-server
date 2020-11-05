import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from '../app/models/user.entity';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: '@MEGAWATT13',
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [UserService, AuthService],
})
export class AuthModule {}
