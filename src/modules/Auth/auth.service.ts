import { User } from "@modules/User/entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login.dto";
import {hashPassword, comparePasswords} from "@lib/utils"
import { ErrorEnum } from "@lib/enums";
import { env } from "@shared/env";
import jwt from "jsonwebtoken"
import { Email } from "@core/abstractions/email";
import { MailOptions } from "@lib/types";
import {resetPasswordTemplate,welcomeTemplate} from "./email/template";
import { Repository } from "typeorm";

export class AuthService{
  constructor(
    private readonly authRepository: Repository<User>,
    private readonly emailService: Email<MailOptions>
  ){}

  async register(createUserDTO: CreateUserDto): Promise<User> {
    const isAlreadyRegistered = await this.authRepository.findOne({ where: { email: createUserDTO.email } });
    if (isAlreadyRegistered) {
      throw new Error(ErrorEnum.USER_ALREADY_EXISTS.message);
    }
    createUserDTO.password = await hashPassword(createUserDTO.password);
    const user = await  this.authRepository.save(createUserDTO);
    await this.emailService.send({
      to: user.email,
      subject: "Welcome to Payment Records",
      from: process.env.EMAIL_USER,
      html: welcomeTemplate(user.name)
    })
    return user;
  }

  async login(LoginUserDto: LoginUserDto){
    const user = await this.authRepository.findOne({ where: { email: LoginUserDto.email } });

    if(!user){
      throw new Error(ErrorEnum.INVALID_CREDENTIALS.message);
    }
    const isValidPassword = await comparePasswords(LoginUserDto.password, user.password);
    if(!isValidPassword){
      throw new Error(ErrorEnum.INVALID_CREDENTIALS.message);
    };

  const access_token = jwt.sign(
      {
      email: user.email,
      id: user.id
    }, env.ACCESS_SECRET,
    {expiresIn: env.ACCESS_EXPIRE as number})

    const refresh_token = jwt.sign({
      id: user.id
    }, env.REFRESH_SECRET,
    {
      expiresIn: env.REFRESH_EXPIRE as number
    })

    return {
      ...user,
      access_token,
      refresh_token
    }
  }

  async refreshToken( refreshToken: string) {

      const decoded = jwt.verify(refreshToken, env.REFRESH_SECRET);

      if(!decoded) throw new Error(ErrorEnum.UNAUTHORIZED.message);

      const newAccessToken = jwt.sign(
        {
          id: (decoded as {id: string}).id
        },
        env.ACCESS_SECRET,
        { expiresIn: env.ACCESS_EXPIRE as number }
      );

      return {
        access_token: newAccessToken
      };
  }

   logout(){
    return;
  }

  async forgotPassword(email: string){
    const user = await this.authRepository.findOne({where: {email}});

    if(!user) throw new Error(ErrorEnum.NOT_FOUND.message);

    const resetToken = jwt.sign(
      { id: user.id },
      env.RESET_SECRET,
      { expiresIn: env.RESET_EXPIRE as number }
    );

    try {
    await this.emailService.send({
      to: user.email,
      subject: "Password Reset",
      from: process.env.EMAIL_USER,
      html: resetPasswordTemplate(resetToken, user.name)
    })

      return {message: "Password reset email sent"}
    } catch (error) {
      console.log(error)
      throw new Error(ErrorEnum.INTERNAL_SERVER_ERROR.message);
    }
  }

  async resetPassword(token: string, newPassword: string){
    const decoded = jwt.verify(token, env.RESET_SECRET);
    if(!decoded) throw new Error(ErrorEnum.UNAUTHORIZED.message);

    const userId = (decoded as {id: string}).id;

    const user = await this.authRepository.findOne({where: {id: userId}});

    if(!user) throw new Error(ErrorEnum.NOT_FOUND.message);

    const hashedPassword = await hashPassword(newPassword);
    await this.authRepository.update(userId, { password: hashedPassword });
    return { message: "Password updated successfully" };
  }

}
