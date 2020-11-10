import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from 'src/app/models/donation.entity';
import { UserService } from 'src/modules/auth/user/user.service';
import { User } from 'src/app/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, User])],
  providers: [DonationService, UserService],
  controllers: [DonationController],
})
export class DonationModule {}
