import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sell } from 'src/app/models/sell.entity';
import { SellService } from './sell.service';
import { SellController } from './sell.controller';
import { UserService } from 'src/auth/user/user.service';
import { User } from 'src/app/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sell, User])],
  providers: [SellService, UserService],
  controllers: [SellController],
})
export class SellModule {}
