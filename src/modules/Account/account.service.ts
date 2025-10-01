import { Repository } from "typeorm";
import { Account } from "./entity/account.entity";
import { ErrorEnum } from "@lib/enums";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import type { DefaultMessage } from "@lib/types";

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

    async delete(id: string): Promise<void | DefaultMessage>{
        const exists = await this.accountRepository.findOneBy({id});

        if(!exists){
            throw new Error(ErrorEnum.NOT_FOUND.message)
        };

        await this.accountRepository.delete({id});
        return {
            success: true,
            message: "Account deleted successfully"
        };
    }

    async findOne(accountNumber: number): Promise<Account | null>{
        const account = await this.accountRepository.findOneBy({accountNumber});
        if(!account) return null;
        return account;
    }

    
}