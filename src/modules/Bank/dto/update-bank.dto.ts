import { IsString, IsOptional } from "class-validator";

export class UpdateBankDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
