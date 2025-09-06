import { User } from "@modules/User/entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login.dto";
import { AuthRepository } from "./repository/auth.repository";
import {hashPassword, comparePasswords} from "@lib/utils"
import { ErrorEnum } from "@lib/enums";
import { env } from "@shared/env";
import jwt from "jsonwebtoken"

export class AuthService{
  constructor(
    private readonly authRepository: AuthRepository
  ){}

  async register(createUserDTO: CreateUserDto): Promise<User> {
    const isAlreadyRegistered = await this.authRepository.findByEmail(createUserDTO.email);
    if (isAlreadyRegistered) {
      throw new Error(ErrorEnum.USER_ALREADY_EXISTS.message);
    }
    createUserDTO.password = await hashPassword(createUserDTO.password);
    const user = await  this.authRepository.create(createUserDTO);
    return user;
  }

  async login(LoginUserDto: LoginUserDto){
    const user = await this.authRepository.findByEmail(LoginUserDto.email);

    if(!user){
      throw new Error(ErrorEnum.INVALID_CREDENTIALS.message);
    }
    const isValidPassword = await comparePasswords(LoginUserDto.password, user.password);
    if(!isValidPassword){
      throw new Error(ErrorEnum.INVALID_CREDENTIALS.message);
    };

  const acess_token = jwt.sign(
      {
      email: user.email,
      id: user.id
    }, env.JWT_SECRET,
    {expiresIn: env.ACCESS_EXPIRE as number})

    const refresh_token = jwt.sign({
      id: user.id
    }, env.JWT_SECRET,
    {
      expiresIn: env.REFRESH_EXPIRE as number
    })

    return {
      ...user,
      acess_token,
      refresh_token
    }
  }

  async refreshToken( refreshToken: string) {

      const decoded = jwt.verify(refreshToken, env.JWT_SECRET);

      if(!decoded) throw new Error(ErrorEnum.UNAUTHORIZED.message);

      const newAccessToken = jwt.sign(
        {
          id: (decoded as {id: string}).id
        },
        env.JWT_SECRET,
        { expiresIn: env.ACCESS_EXPIRE as number }
      );

      return {
        access_token: newAccessToken
      };
  }

   logout(){
    // Not implemented because we are using stateless JWT tokens
    return;
  }



}
