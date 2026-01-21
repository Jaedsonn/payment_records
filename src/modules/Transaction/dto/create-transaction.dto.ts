import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
} from "class-validator";
import { TransactionType, TransactionCategory } from "@lib/enums";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTransactionDto:
 *       type: object
 *       required: [accountId, amount, type, from, to]
 *       properties:
 *         accountId:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         type:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAWAL, TRANSFER]
 *           description: Type of transaction
 *         description:
 *           type: string
 *           description: Optional transaction description
 *         from:
 *           type: string
 *           description: Source identifier
 *         to:
 *           type: string
 *           description: Destination identifier
 *         category:
 *           type: string
 *           enum: [SALARY, UTILITIES, FOOD, ENTERTAINMENT, OTHER]
 *           description: Optional transaction category
 */
export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsEnum(TransactionCategory)
  @IsOptional()
  category?: TransactionCategory;
}
