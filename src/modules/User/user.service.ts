import { UserRepository } from "./repository/user.repository";
import { UpdateUserDto } from "./dto/updater-user.dto";

export class UserService{
  constructor(
    private readonly userRepository: UserRepository,
  ){}

  async updateUser(id: string, updateData: Partial<UpdateUserDto>){
    return this.userRepository.updateUser(id, updateData);
  }

  async getUserInfo(id: string){
    return this.userRepository.findById(id);
  }
}
