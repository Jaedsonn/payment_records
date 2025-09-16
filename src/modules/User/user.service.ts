import { UserRepository } from "./repository/user.repository";
import { UpdateUserDto } from "./dto/updater-user.dto";
import { Bank } from "@modules/Bank/entity/bank.entity";

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

  async getMostUsedBanks (id: string){
    const banks = await this.userRepository.getAllBanks(id);
    const best = {
      bank: null as Bank | null,
      transactions: 0,

    };
    for(const b of banks){
      if(b.transactions.length > best.transactions){
        best.bank = b;
        best.transactions = b.transactions.length;
      }
    }

    return best;
  }
}
