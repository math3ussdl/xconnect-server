import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { Product } from 'src/app/models/product.entity';
import { ISellDTO, ISellUpdated, Sell } from 'src/app/models/sell.entity';
import { UserService } from 'src/modules/auth/user/user.service';
import { SellService } from './sell.service';

@Controller('sell')
export class SellController {
  constructor(
    private readonly sellService: SellService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
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

    const sellCreated = await this.sellService.create(sell);

    await this.mailService.send({
      to: sellCreated.buyer.email,
      from: 'limabrot879@gmail.com',
      subject: 'Parabéns!',
      text: 'Sua Compra foi feita com sucesso!',
      html: `
        <strong>
          Acompanhe pelo sistema o status do seu pedido! <br />
          <em>Código</em>: ${sellCreated.id} <br />
          <em>Status</em>: ${sellCreated.status} <br />
        </strong>
      `,
    });

    return sellCreated;
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
    return await this.sellService.delete(params.id);
  }
}
