import { Body, Controller, Param, Post } from '@nestjs/common';
import { ISellDTO, Sell } from 'src/app/models/sell.entity';
import { UserService } from 'src/auth/user/user.service';
import { SellService } from './sell.service';

@Controller('sell')
export class SellController {
  constructor(
    private readonly sellService: SellService,
    private readonly userService: UserService,
  ) {}

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

    return await this.sellService.create(sell);
  }
}
