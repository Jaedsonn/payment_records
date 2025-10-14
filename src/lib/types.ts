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

export type DefaultMessage = {
  success: boolean;
  message: string;
  data?: unknown;
}