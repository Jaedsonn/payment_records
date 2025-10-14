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

    async update(id: string, account: Account): Promise<UpdateAccountDto>{
        const exists = await  this.accountRepository.findOneBy({id});

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

    async listUserAccounts(id: string): Promise<Account[]>{
        return this.accountRepository.findBy({id});
    }

    async getAccountById(id: string): Promise<Account | null>{
        const account = await this.accountRepository.findOneBy({id});
        if(!account) return null;
        return account;
    }


    async getAccountByAccountNumber(accountNumber: number): Promise<Account | null>{
        const account = await this.accountRepository.findOneBy({accountNumber});

        if(!account) return null;
        return account;
    }

    async aliveOrDeadAccount(id: string): Promise<DefaultMessage>{
        const account = await this.accountRepository.findOneBy({id});

        if(!account) throw new Error(ErrorEnum.NOT_FOUND.message);
        account.isActive = !account.isActive;
        await this.accountRepository.save(account);
        return {
            success: true,
            message: account.isActive ? "Account activated successfully" : "Account desactivated successfully"
        };
        
    }

    async getAccountBalance(id: string): Promise<DefaultMessage>{
        const account = await this.accountRepository.findOne({where: {id}, select: ["balance"]});
        if(!account) throw new Error(ErrorEnum.NOT_FOUND.message);
        return {
            success: true,
            message: `Account balance is ${account.balance}`,
            data: {balance: account.balance},
        }
    }


}