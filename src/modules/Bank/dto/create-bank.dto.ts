import { IsNotEmpty, IsString } from "class-validator";

/**
 * @swagger
 * components:
   *   schemas:
 *     CreateBankDto:
 *       type: object
 *       required:
 *         - name
 *         - code
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 */
export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
