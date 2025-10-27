import { Email } from "core/abstractions/email";
import nodemailer from "nodemailer";
import { MailOptions } from "@lib/types";


class Nodemailer extends Email<MailOptions>{

  constructor(){
    super({
      sendEmail: async (options: MailOptions) => {
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
    console.debug("Enviando email para:", mailOptions.to);
    return this.transporter.sendEmail(mailOptions);
  }
}

export default Nodemailer
