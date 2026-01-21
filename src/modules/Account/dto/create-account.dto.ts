import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUUID,
} from "class-validator";
import { Account as AccountType } from "@lib/enums";

/**
 * @swagger
 * components:
 *  schemas:
 *     CreateAccountDto:
 *      type: object
 *      required: [name, accountNumber, agency, accountType, bankId]
 * 
 *      properties:
 * 
 *        name:
 *          type: string
 * 
 *        accountNumber:
 *          type: string
 * 
 *        agency:
 *          type: string
 * 
 *        balance:
 *          type: number
 * 
 *        isActive:
 *          type: boolean
 *          default: true
 * 
 *        accountType:
 *          type: string
 *          enum: [CHECKING, SAVINGS, BUSINESS, JOINT, INVESTMENT, STUDENT]
 * 
 *        bankId:
 *          type: string
 *          format: uuid
 */

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsString()
  accountNumber: string;

  @IsString()
  agency: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsUUID()
  bankId: string;
}
