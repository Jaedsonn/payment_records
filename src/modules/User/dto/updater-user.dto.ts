import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The email of the user.
 *           example: john.doe@example.com
 */

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
