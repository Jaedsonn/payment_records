import { IsEmail, IsNotEmpty, IsString } from "class-validator"

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateUserDto:
 *      type: object
 *      required: [name, age, email, password]
 *      properties:
 * 
 *        name:
 *          type: string
 * 
 *        age:
 *          type: number
 * 
 *        email:
 *          type: string
 * 
 *        password:
 *          type: string
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  age: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
