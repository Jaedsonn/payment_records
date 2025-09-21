import { BankRepository } from "./repository/bank.repository";

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
}