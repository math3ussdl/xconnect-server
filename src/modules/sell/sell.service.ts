import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sell } from 'src/app/models/sell.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepository: Repository<Sell>,
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
}
