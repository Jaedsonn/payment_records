import { User } from "@modules/User/entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login.dto";
import { AuthRepository } from "./repository/auth.repository";
import {hashPassword, comparePasswords} from "@lib/utils"
import { ErrorEnum } from "@lib/enums";

export class AuthService{
  constructor(
    private readonly authRepository: AuthRepository
  ){}

  async register(createUserDTO: CreateUserDto): Promise<User> {
    const isAlreadyRegistered = await this.authRepository.findByEmail(createUserDTO.email);
    if (isAlreadyRegistered) {
      throw new Error(ErrorEnum.USER_ALREADY_EXISTS.message);
    }
    const user = await  this.authRepository.create(createUserDTO);
    createUserDTO.password = await hashPassword(createUserDTO.password);
    Object.assign(user, createUserDTO);
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

    return user

  }
}
