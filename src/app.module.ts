import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { DonationModule } from './modules/donation/donation.module';
import { SellModule } from './modules/sell/sell.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Postgres2020!',
      database: 'xconn3ct',
      entities: [__dirname + '/app/models/**/*.entity{.ts,.js}'],
      subscribers: [__dirname + '/database/subscribers/*.subscriber{.ts,.js}'],
      cli: {
        entitiesDir: __dirname + '/app/models',
        subscribersDir: __dirname + '/database/subscribers',
      },
      synchronize: true,
    }),
    AuthModule,
    DonationModule,
    SellModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
