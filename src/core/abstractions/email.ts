export interface EmailTransporter{
  sendEmail(mailOptions: unknown): unknown
}

export abstract class Email<T>{
  constructor(
    protected readonly transporter: EmailTransporter
  ){}

  abstract send(mailOptions: T): unknown;
}
