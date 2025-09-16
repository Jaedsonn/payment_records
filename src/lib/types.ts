import nodemailer from "nodemailer"

export type ErrorType = {
  message: string;
  status: number;
}

export type MailOptions = nodemailer.SendMailOptions;

export type AccessPayload = {
  email: string
  id: string
}