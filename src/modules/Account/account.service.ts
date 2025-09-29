import { Repository } from "typeorm";
import { Account } from "./entity/account.entity";
import { ErrorEnum } from "@lib/enums";

export default class AccountService{

    constructor(
        private readonly accountRepository: Repository<Account>
    ){}

    async create(account: Account): Promise<Account>{
        const exists = await this.accountRepository.findOneBy({accountNumber: account.accountNumber});

        if(exists){
            throw new Error(ErrorEnum.CONFLICT.message);
        }
        return this.accountRepository.save(account)
    }

}