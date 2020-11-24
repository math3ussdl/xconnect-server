import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation, IDonationUpdated } from 'src/app/models/donation.entity';
import { User } from 'src/app/models/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from '../auth/user/user.service';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    private readonly userService: UserService,
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
          products: 'donation.products',
        },
      },
    });
  }

  async readByDonor(user: User): Promise<Donation[]> {
    return await this.donationRepository.find({
      where: { donor: user },
      join: {
        alias: 'donation',
        leftJoinAndSelect: {
          donor: 'donation.donor',
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

  async accept(id: string, userAcceptedId: string): Promise<Donation> {
    const targetDonation = await this.readOne(id);
    const acceptUser = await this.userService.readById(userAcceptedId);

    return await this.update(id, {
      ...targetDonation,
      receipt: acceptUser,
      status: 'Em Andamento',
    });
  }

  async complete(id: string): Promise<Donation> {
    const targetDonation = await this.readOne(id);

    return await this.update(id, {
      ...targetDonation,
      donor: null,
      status: 'Entregue',
    });
  }
}
