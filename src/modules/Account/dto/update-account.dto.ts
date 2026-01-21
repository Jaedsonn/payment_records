import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Account as AccountType } from "@lib/enums";

/**
 * @swagger
 * components:
 *  schemas:
 *     UpdateAccountDto:
 *      type: object
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
 */

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  agency?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(AccountType)
  @IsOptional()
  accountType?: AccountType;
}
