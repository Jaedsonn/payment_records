export interface EmailTransporter{
  sendEmail(mailOptions: any): any
}

export abstract class Email{
  constructor(
    protected readonly transporter: EmailTransporter
  ){}

  abstract send(mailOptions: any): any;
}
