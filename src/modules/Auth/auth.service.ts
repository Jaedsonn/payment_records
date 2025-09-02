import { User } from "@modules/User/entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthRepository } from "./repository/auth.repository";
import {hashPassword} from "@lib/utils"
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
}
