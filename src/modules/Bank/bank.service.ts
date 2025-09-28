import { Bank } from "./entity/bank.entity";
import { Repository } from "typeorm";

export class BankService {
    constructor(
        private readonly bankRepository: Repository<Bank>
    ){}


    public async getBankDetailsById(id: string){
        return await this.bankRepository.findOne({ where: { id } });
    }

    public async getBankDetailsByName(name: string){
        return await this.bankRepository.findOne({ where: { name } });
    }

    // This its all admin routes
    public async registerBank(data: Partial<Bank>){
        return await this.bankRepository.save(data);
    }

    public async getAllBanks(){
        return await this.bankRepository.find();
    }

    public async updateBankDetails(id: string, data: Partial<Bank>){
        return await this.bankRepository.update(id, data);
    }

    public async removeBank(id: string){
        return await this.bankRepository.delete(id);
    }
}