import {IsEmail, IsNotEmpty} from "class-validator"

/**
 * @swagger
 * components:
 *  schemas:
 *    LoginUserDto:
 *      type: object
 *      required: [email, password]
 *      properties:
 * 
 *        email:
 *          type: string
 * 
 *        password:
 *          type: string
*/
export class LoginUserDto{
  @IsEmail()
  @IsNotEmpty()
  email:string

  @IsNotEmpty()
  password: string;
}
