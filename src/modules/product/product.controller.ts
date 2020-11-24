import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly prodService: ProductService) {}

  @Get()
  async list(): Promise<any> {
    return this.prodService.list();
  }

  @Get(':state')
  async filter(@Param() params: { state: string }): Promise<any> {
    return this.prodService.filter(params.state);
  }
}
