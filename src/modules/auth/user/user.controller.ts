import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { IUserUpdate } from '../../../app/models/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list(): Promise<any> {
    return this.userService.read();
  }

  @Get(':id')
  async find(@Param() params: { id: string }): Promise<any> {
    return this.userService.readById(params.id);
  }

  @Put(':id')
  async update(@Param() params: { id: string }, @Body() user: IUserUpdate): Promise<any> {
    return this.userService.update(params.id, user);
  }
}
