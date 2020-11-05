import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Product } from 'src/app/models/product.entity';
import { ISellDTO, ISellUpdated, Sell } from 'src/app/models/sell.entity';
import { UserService } from 'src/auth/user/user.service';
import { ProductService } from 'src/product/product.service';
import { SellService } from './sell.service';

@Controller('sell')
export class SellController {
  constructor(
    private readonly sellService: SellService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async list(): Promise<any> {
    return this.sellService.read();
  }

  @Get(':id')
  async detail(@Param() params: { id: string }): Promise<any> {
    return this.sellService.readOne(params.id);
  }

  @Post(':id')
  async store(
    @Param() params: { id: string },
    @Body() bodySell: ISellDTO,
  ): Promise<any> {
    const targetBuyerUser = await this.userService.readById(params.id);
    const seller = await this.userService.readByEmail(bodySell.sellerEmail);

    const sell = new Sell();
    sell.buyer = targetBuyerUser;
    sell.products = bodySell.products;
    sell.seller = seller;

    bodySell.products.forEach(async (p: Product) => {
      return await this.productService.store(p);
    });

    return await this.sellService.create(sell);
  }

  // @Put(':id')
  // async update(
  //   @Param() params: { id: string },
  //   @Body() sell: ISellUpdated,
  // ): Promise<any> {
  //   return await this.sellService.update(params.id, sell);
  // }

  @Delete(':id')
  async delete(
    @Param() params: { id: string }
  ): Promise<any> {
    const { products } = await this.sellService.readOne(params.id);

    products.forEach(async p => {
      return await this.productService.delete(p.id);
    });

    return await this.sellService.delete(params.id);
  }
}
