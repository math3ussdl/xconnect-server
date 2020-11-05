import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Donation, IDonationDTO, IDonationUpdated } from 'src/app/models/donation.entity';
import { Product } from 'src/app/models/product.entity';
import { UserService } from 'src/auth/user/user.service';
import { ProductService } from 'src/product/product.service';
import { DonationService } from './donation.service';

@Controller('donation')
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async list(): Promise<any> {
    return this.donationService.read();
  }

  @Get(':id')
  async detail(@Param() params: { id: string }): Promise<any> {
    return this.donationService.readOne(params.id);
  }

  @Post(':id')
  async store(
    @Param() params: { id: string },
    @Body() bodyDonation: IDonationDTO,
  ): Promise<any> {
    const targetUser = await this.userService.readById(params.id);
    const receiver = await this.userService.readByEmail(bodyDonation.receiverEmail);

    const donation = new Donation();
    donation.donor = targetUser;
    donation.products = bodyDonation.products;
    donation.receiver = receiver;

    bodyDonation.products.forEach(async (p: Product) => {
      return await this.productService.store(p);
    });

    return await this.donationService.create(donation);
  }

  // @Put(':id')
  // async update(
  //   @Param() params: { id: string },
  //   @Body() donation: IDonationUpdated,
  // ): Promise<any> {
  //   return await this.donationService.update(params.id, donation);
  // }

  @Delete(':id')
  async delete(
    @Param() params: { id: string }
  ): Promise<any> {
    const { products } = await this.donationService.readOne(params.id);

    products.forEach(async p => {
      return await this.productService.delete(p.id);
    });

    return await this.donationService.delete(params.id);
  }
}
