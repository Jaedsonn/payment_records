import nodemailer from "nodemailer"
import { Role } from "./enums";

/**
 * @swagger
 * components:
 *  schemas:
 *    ErrorType:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        status:
 *          type: number
 */
export type ErrorType = {
  message: string;
  status: number;
}

export type MailOptions = nodemailer.SendMailOptions;

/**
 * @swagger
 * components:
 *  schemas:
 *    AccessPayload:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        id:
 *          type: string
 */
export type AccessPayload = {
  email: string
  id: string
  role: Role
}

/**
 * @swagger
 * components:
 *  schemas:
 *    DefaultMessage:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        message:
 *          type: string
 *        data:
 *          type: object
 */

export type DefaultMessage = {
  success: boolean;
  message: string;
  data?: unknown;
}