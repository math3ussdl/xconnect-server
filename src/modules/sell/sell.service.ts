import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sell } from 'src/app/models/sell.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from '../auth/user/user.service';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepository: Repository<Sell>,
    private readonly userService: UserService
  ) {}

  async create(sell: Sell): Promise<Sell> {
    return await this.sellRepository.save(sell);
  }

  async read(): Promise<Sell[]> {
    return this.sellRepository.find();
  }

  async readOne(id: string): Promise<Sell> {
    return await this.sellRepository.findOne(id);
  }

  async update(id: string, newVal: Sell): Promise<Sell> {
    await this.sellRepository.update(id, newVal);
    return await this.readOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.sellRepository.delete(id);
  }

  async accept(id: string, sellerAcceptedId: string): Promise<Sell> {
    const targetSell = await this.readOne(id);
    const acceptSeller = await this.userService.readById(sellerAcceptedId);

    return await this.update(id, {
      ...targetSell,
      seller: acceptSeller,
      status: 'Pendente',
    });
  }

  async complete(id: string): Promise<Sell> {
    const targetSell = await this.readOne(id);

    return await this.update(id, {
      ...targetSell,
      seller: null,
      status: 'Concluida',
    });
  }
}
