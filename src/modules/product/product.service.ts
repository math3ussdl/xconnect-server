import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/app/models/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async list(): Promise<Product[]> {
    return await this.productRepository.find({
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          donation: 'product.donation',
        },
      },
    });
  }

  async filter(state: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { state },
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          donation: 'product.donation',
        },
      },
    });
  }
}
