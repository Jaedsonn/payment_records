import { Repository, DataSource } from "typeorm";
import { Transaction } from "./entity/trasaction.entity";
import { Account } from "@modules/Account/entity/account.entity";
import { DefaultMessage } from "@lib/types";
import { ErrorEnum, TransactionType } from "@lib/enums";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

export class TransactionService {
  constructor(
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource
  ) {}

  async createTransaction(
    userId: string,
    data: CreateTransactionDto
  ): Promise<Transaction> {
    const account = await this.accountRepository.findOne({
      where: { id: data.accountId },
      relations: ["user"],
    });

    if (!account) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    if (account.user.id !== userId) {
      throw new Error(ErrorEnum.FORBIDDEN.message);
    }

    if (!account.isActive) {
      throw new Error(ErrorEnum.ACCOUNT_BLOCKED.message);
    }

    const amount = Number(data.amount);
    let newBalance = Number(account.balance);

    if (
      [
        TransactionType.WITHDRAWAL,
        TransactionType.PAYMENT,
        TransactionType.FEE,
      ].includes(data.type)
    ) {
      if (newBalance < amount) {
        throw new Error(ErrorEnum.INSUFFICIENT_FUNDS.message);
      }
      newBalance = Number((newBalance - amount).toFixed(2));
    } else if (
      [
        TransactionType.DEPOSIT,
        TransactionType.TRANSFER,
        TransactionType.REFUND,
        TransactionType.INTEREST,
      ].includes(data.type)
    ) {
      newBalance = Number((newBalance + amount).toFixed(2));
    }

    const result = await this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(Transaction);
      const accountRepo = manager.getRepository(Account);

      const transaction = txRepo.create({
        ...data,
        account,
      });

      const savedTx = await txRepo.save(transaction);

      account.balance = newBalance;
      await accountRepo.save(account);

      return savedTx;
    });

    return result;
  }

  async listTransactions(
    userId: string,
    accountId?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Transaction[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.account", "account")
      .leftJoin("account.user", "user")
      .where("user.id = :userId", { userId });

    if (accountId) {
      queryBuilder.andWhere("account.id = :accountId", { accountId });
    }

    return queryBuilder
      .orderBy("transaction.createdAt", "DESC")
      .skip(offset)
      .take(limit)
      .getMany();
  }

  async getTransactionById(
    transactionId: string,
    userId: string
  ): Promise<Transaction | null> {
    return this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.account", "account")
      .leftJoin("account.user", "user")
      .where("transaction.id = :transactionId", { transactionId })
      .andWhere("user.id = :userId", { userId })
      .getOne();
  }

  async updateTransaction(
    transactionId: string,
    userId: string,
    updateData: UpdateTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.getTransactionById(transactionId, userId);

    if (!transaction) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    Object.assign(transaction, updateData);

    return this.transactionRepository.save(transaction);
  }

  async deleteTransaction(
    transactionId: string,
    userId: string
  ): Promise<DefaultMessage> {
    const transaction = await this.getTransactionById(transactionId, userId);

    if (!transaction) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    await this.transactionRepository.remove(transaction);

    return {
      success: true,
      message: "Transaction deleted successfully",
    };
  }

  async getTransactionSummary(
    userId: string,
    accountId?: string
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  }> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoin("transaction.account", "account")
      .leftJoin("account.user", "user")
      .where("user.id = :userId", { userId });

    if (accountId) {
      queryBuilder.andWhere("account.id = :accountId", { accountId });
    }

    const transactions = await queryBuilder.getMany();

    const summary = transactions.reduce(
      (acc, tx) => {
        const amount = Number(tx.amount);

        if (
          [
            TransactionType.DEPOSIT,
            TransactionType.TRANSFER,
            TransactionType.REFUND,
            TransactionType.INTEREST,
          ].includes(tx.type)
        ) {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }

        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );

    return {
      totalIncome: Number(summary.totalIncome.toFixed(2)),
      totalExpenses: Number(summary.totalExpenses.toFixed(2)),
      balance: Number((summary.totalIncome - summary.totalExpenses).toFixed(2)),
      transactionCount: transactions.length,
    };
  }
}
