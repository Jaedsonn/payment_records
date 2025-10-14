import { UpdateUserDto } from "./dto/updater-user.dto";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { ErrorEnum } from "@lib/enums";

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async getUserInfo(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ["accounts"],
    });
  }
}
