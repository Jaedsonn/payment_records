import { BankRepository } from "./repository/bank.repository";
import { Bank } from "./entity/bank.entity";

export class BankService {
    constructor(
        private readonly bankRepository: BankRepository
    ){}


    public async getBankDetailsById(id: string){
        return await this.bankRepository.findById(id);
    }

    public async getBankDetailsByName(name: string){
        return await this.bankRepository.findByName(name);
    }

    public async registerBank(data: Partial<Bank>){
        return await this.bankRepository.createBank(data);
    }

    public async getAllBanks(){
        return await this.bankRepository.findAllBanks();
    }

    public async updateBankDetails(id: string, data: Partial<Bank>){
        return await this.bankRepository.updateBank(id, data);
    }

    public async removeBank(id: string){
        return await this.bankRepository.deleteBank(id);
    }
}