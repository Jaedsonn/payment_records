import { Repository } from "typeorm";
import { Account } from "./entity/account.entity";
import { User } from "@modules/User/entity/user.entity";
import { Bank } from "@modules/Bank/entity/bank.entity";
import { ErrorEnum } from "@lib/enums";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import type { DefaultMessage } from "@lib/types";

export default class AccountService {
  constructor(
    private readonly accountRepository: Repository<Account>,
    private readonly userRepository: Repository<User>,
    private readonly bankRepository: Repository<Bank>
  ) {}

  async create(
    userId: string,
    accountData: CreateAccountDto
  ): Promise<Account> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    const bank = await this.bankRepository.findOneBy({
      id: accountData.bankId,
    });
    if (!bank) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    const existingAccount = await this.accountRepository.findOneBy({
      accountNumber: accountData.accountNumber,
    });
    if (existingAccount) {
      throw new Error(ErrorEnum.CONFLICT.message);
    }

    const account = this.accountRepository.create({
      ...accountData,
      user,
      bank,
      balance: accountData.balance || 0,
      isActive:
        accountData.isActive !== undefined ? accountData.isActive : true,
    });

    return this.accountRepository.save(account);
  }

  async update(
    accountId: string,
    userId: string,
    accountData: UpdateAccountDto
  ): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });

    if (!account) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    if (
      accountData.accountNumber &&
      accountData.accountNumber !== account.accountNumber
    ) {
      const existingAccount = await this.accountRepository.findOneBy({
        accountNumber: accountData.accountNumber,
      });
      if (existingAccount) {
        throw new Error(ErrorEnum.CONFLICT.message);
      }
    }

    Object.assign(account, accountData);
    return this.accountRepository.save(account);
  }

  async delete(accountId: string, userId: string): Promise<DefaultMessage> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });

    if (!account) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    await this.accountRepository.remove(account);

    return {
      success: true,
      message: "Account deleted successfully",
    };
  }

  async listUserAccounts(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { user: { id: userId } },
      relations: ["bank"],
      order: { createdAt: "DESC" },
    });
  }

  async getAccountById(
    accountId: string,
    userId: string
  ): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
      relations: ["user", "bank", "transactions"],
    });
  }

  async getAccountByAccountNumber(
    accountNumber: string,
    userId: string
  ): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { accountNumber, user: { id: userId } },
      relations: ["bank"],
    });
  }

  async aliveOrDeadAccount(
    accountId: string,
    userId: string
  ): Promise<DefaultMessage> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });

    if (!account) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    account.isActive = !account.isActive;
    await this.accountRepository.save(account);

    return {
      success: true,
      message: account.isActive
        ? "Account activated successfully"
        : "Account deactivated successfully",
    };
  }

  async getAccountBalance(
    accountId: string,
    userId: string
  ): Promise<DefaultMessage> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
      select: ["balance"],
    });

    if (!account) {
      throw new Error(ErrorEnum.NOT_FOUND.message);
    }

    return {
      success: true,
      message: `Account balance retrieved successfully`,
      data: { balance: account.balance },
    };
  }
}
