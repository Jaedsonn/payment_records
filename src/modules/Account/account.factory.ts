import { Account } from "@modules/Account/entity/account.entity";
import { User } from "@modules/User/entity/user.entity";
import { Bank } from "@modules/Bank/entity/bank.entity";
import AccountService from "@modules/Account/account.service";
import { AccountController } from "@modules/Account/account.controller";
import { AppDataSource } from "@shared/db/data-source";

export class AccountFactory {
  static createController() {
    return new AccountController(
      new AccountService(
        AppDataSource.getRepository(Account),
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(Bank)
      )
    );
  }
}
