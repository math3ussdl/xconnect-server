import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import {
  Donation,
  IDonationDTO,
  IDonationUpdated,
} from 'src/app/models/donation.entity';
import { UserService } from 'src/modules/auth/user/user.service';
import { DonationService } from './donation.service';

@Controller('donation')
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  async list(): Promise<any> {
    return this.donationService.read();
  }

  @Get(':id')
  async listByDonor(@Param() params: { id: string }): Promise<any> {
    const targetUser = await this.userService.readById(params.id);

    return this.donationService.readByDonor(targetUser);
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

    const donation = new Donation();
    donation.donor = targetUser;
    donation.products = bodyDonation.products;

    const donationCreated = await this.donationService.create(donation);

    await this.mailService.send({
      to: donationCreated.donor.email,
      from: 'limabrot879@gmail.com',
      subject: 'Parabéns! Sua Doação foi feita com sucesso!',
      html: `
        <strong>
          Acompanhe pelo sistema o status de sua doação! <br />
          <em>Código</em>: ${donationCreated.id} <br />
          <em>Status</em>: ${donationCreated.status} <br />
        </strong>
      `,
    });

    return donationCreated;
  }

  @Put(':id')
  async update(
    @Param() params: { id: string },
    @Body() donation: IDonationUpdated,
  ): Promise<any> {
    return await this.donationService.update(params.id, donation);
  }

  @Delete(':id')
  async delete(@Param() params: { id: string }): Promise<any> {
    return await this.donationService.delete(params.id);
  }
}
