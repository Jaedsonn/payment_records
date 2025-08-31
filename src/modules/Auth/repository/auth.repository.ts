import { User } from "@modules/User/entity/user.entity"
import { AppDataSource } from "@shared/data-source";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";

interface IAuthRepository<T> {
  findByEmail(email: string): Promise<T | null>;
  create(user: CreateUserDto): Promise<T>;
}

export class AuthRepository implements IAuthRepository<User> {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } }) || null;
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.repository.create();
    Object.assign(newUser, user);
    return this.repository.save(newUser);
  }

}
