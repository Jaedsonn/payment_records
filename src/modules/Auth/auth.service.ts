import { User } from "@modules/User/entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthRepository } from "./repository/auth.repository";

export class AuthService{
  constructor(
    private readonly authRepository: AuthRepository
  ){}

  async register(createUserDTO: CreateUserDto): Promise<User> {
    const isAlreadyRegistered = await this.authRepository.findByEmail(createUserDTO.email);
    if (isAlreadyRegistered) {
      throw new Error('User already registered');
    }
    const user = this.authRepository.create(createUserDTO);
    Object.assign(user, createUserDTO);
    return user;
  }
}
