import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { AppDataSource } from "@shared/db/data-source";
import { Transaction } from "./entity/trasaction.entity";
import { Account } from "@modules/Account/entity/account.entity";

const transactionRepository = AppDataSource.getRepository(Transaction);
const accountRepository = AppDataSource.getRepository(Account);

export class TransactionFactory {
  private static transactionController: TransactionController;

  static createController(): TransactionController {
    if (!this.transactionController) {
      const transactionService = new TransactionService(
        transactionRepository,
        accountRepository,
        AppDataSource
      );

      this.transactionController = new TransactionController(
        transactionService
      );
    }

    return this.transactionController;
  }
}
