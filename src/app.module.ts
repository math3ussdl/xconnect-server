import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.25.0.2',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
