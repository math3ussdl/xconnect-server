import { Injectable } from '@nestjs/common';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import config from '../../app/config/app';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailService,
  ) {
    this.mailService.setApiKey(config.sendgrid_api);
  }

  async send(mail: MailDataRequired): Promise<any> {
    return await this.mailService.send(mail)
      .then(() => console.log('Email Sent.'))
      .catch(err => console.log(err));
  }
}
