import { UpdateUserDto } from "./dto/updater-user.dto";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";

export class UserService{
  constructor(
    private readonly userRepository: Repository<User>,
  ){}

  async updateUser( id: string, updateData: Partial<UpdateUserDto>){
    return this.userRepository.update(id, updateData);
  }

  async getUserInfo(id: string){
    return this.userRepository.findOne({ where: { id } });
  }

}
