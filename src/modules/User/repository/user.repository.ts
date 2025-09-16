import { User } from "@modules/User/entity/user.entity"
import { AppDataSource } from "@shared/data-source";
import { Repository } from "typeorm";

interface IUserRepository<T> {
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  updateUser(id: string, data: Partial<T>): Promise<T>;
  deleteUser(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository<User> {
  constructor(
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User)
  ){}


  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({where: {email}});
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({where: {id}, relations: {banks: true, transactions: true}});
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.save({...data, id} as User);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.userRepository.delete(id).then(() => {});
  }
}
