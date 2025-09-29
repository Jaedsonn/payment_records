import {Account} from "@modules/Account/entity/account.entity";
import AccountService from "@modules/Account/account.service";
import {AccountController} from "@modules/Account/account.controller"
import { AppDataSource } from "@shared/db/data-source";


export class AccountFactory {
    static createController(){
        return new AccountController(new AccountService( AppDataSource.getRepository(Account) ))
    }
}