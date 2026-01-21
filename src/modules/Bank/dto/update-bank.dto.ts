import { IsString, IsOptional } from "class-validator";

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateBankDto:
 *     type: object
 *     properties:
 * 
 *       name:
 *         type: string
 * 
 *       code:
 *         type: string
 */
export class UpdateBankDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
