import { UpdateUserDto } from "./dto/updater-user.dto";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";

export class UserService{
  constructor(
    private readonly userRepository: Repository<User>,
  ){}

  async updateUser( updateData: Partial<UpdateUserDto>){
    return this.userRepository.save(updateData);
  }

  async getUserInfo(id: string){
    return this.userRepository.findOne({ where: { id } });
  }

}
