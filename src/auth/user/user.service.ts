import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, IUserUpdate } from '../../app/models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async read(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async readByRole(role: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { role },
    });
  }

  async readByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, user: IUserUpdate): Promise<User> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({
      where: { id }
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
