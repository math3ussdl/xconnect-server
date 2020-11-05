import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from 'src/app/models/donation.entity';
import { Product } from 'src/app/models/product.entity';
import { Sell } from 'src/app/models/sell.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async store(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.productRepository.delete(id);
  }
}
