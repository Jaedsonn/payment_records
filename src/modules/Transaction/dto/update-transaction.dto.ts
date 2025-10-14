import { IsNumber, IsString, IsEnum, IsOptional } from "class-validator";
import { TransactionType, TransactionCategory } from "@lib/enums";

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
