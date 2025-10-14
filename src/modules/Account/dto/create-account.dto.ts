import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUUID,
} from "class-validator";
import { Account as AccountType } from "@lib/enums";

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
