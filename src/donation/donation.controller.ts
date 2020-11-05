import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Donation, IDonationDTO } from 'src/app/models/donation.entity';
import { UserService } from 'src/auth/user/user.service';
import { DonationService } from './donation.service';

@Controller('donation')
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async list(): Promise<any> {
    return this.donationService.read();
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

    return await this.donationService.create(donation);
  }
}
