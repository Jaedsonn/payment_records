import { IsNumber, IsString, IsEnum, IsOptional } from "class-validator";
import { TransactionType, TransactionCategory } from "@lib/enums";


/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateTransactionDto:
 *      type: object
 *      properties:
 * 
 *        amount:
 *          type: number
 *
 *        type:
 *          type: string
 *          enum: [DEPOSIT, WITHDRAWAL, TRANSFER]
 * 
 *        description:
 *          type: string
 * 
 *        from:
 *          type: string
 * 
 *        to:
 *          type: string
 * 
 *        category:
 *          type: string
 *          enum: [SALARY, UTILITIES, FOOD, ENTERTAINMENT, OTHER]
 */
export class UpdateTransactionDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;

  @IsEnum(TransactionCategory)
  @IsOptional()
  category?: TransactionCategory;
}
