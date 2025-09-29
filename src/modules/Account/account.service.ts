import { Repository } from "typeorm";
import { Account } from "./entity/account.entity";
import { ErrorEnum } from "@lib/enums";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

export default class AccountService{

    constructor(
        private readonly accountRepository: Repository<Account>
    ){}

    async create(account: CreateAccountDto): Promise<CreateAccountDto>{
        const exists = await this.accountRepository.findOneBy({accountNumber: account.accountNumber});

        if(exists){
            throw new Error(ErrorEnum.CONFLICT.message);
        }
        return this.accountRepository.save(account)
    }

    async update(account: UpdateAccountDto): Promise<UpdateAccountDto>{
        const exists = await  this.accountRepository.findOneBy({accountNumber: account.accountNumber});

        if(!exists){
            throw new Error(ErrorEnum.NOT_FOUND.message)
        };

        await this.accountRepository.update({accountNumber: account.accountNumber}, account);
        return  this.accountRepository.findOneBy({accountNumber: account.accountNumber}) as Promise<UpdateAccountDto>;;
    }

}