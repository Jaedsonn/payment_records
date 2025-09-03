import { Email } from "core/abstractions/email";
import * as nodemailer from "nodemailer"


export class Nodemailer extends Email{

  constructor(){
    super({
      sendEmail: async (options) => {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST!,
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        return transporter.sendMail(options);
      }
    });
  }

  send(mailOptions: nodemailer.SendMailOptions) {
    return this.transporter.sendEmail(mailOptions);
  }
}
