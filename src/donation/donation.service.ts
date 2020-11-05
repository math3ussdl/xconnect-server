import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation, IDonationUpdated } from 'src/app/models/donation.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
  ) {}

  async create(donation: Donation): Promise<Donation> {
    return await this.donationRepository.save(donation);
  }

  async read(): Promise<Donation[]> {
    return await this.donationRepository.find({
      join: {
        alias: 'donation',
        leftJoinAndSelect: {
          donor: 'donation.donor',
          receiver: 'donation.receiver',
          products: 'donation.products',
        },
      },
    });
  }

  async readOne(id: string): Promise<Donation> {
    return await this.donationRepository.findOne(id, {
      join: {
        alias: 'donation',
        leftJoinAndSelect: {
          products: 'donation.products',
        },
      },
    });
  }

  async update(id: string, newVal: IDonationUpdated): Promise<Donation> {
    await this.donationRepository.update(id, newVal);
    return await this.readOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.donationRepository.delete(id);
  }
}
