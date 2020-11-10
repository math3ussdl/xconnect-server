import { Module } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { EmailService } from './email.service';

@Module({
  providers: [MailService, EmailService],
  exports: [MailService, EmailService],
})
export class EmailModule {}
