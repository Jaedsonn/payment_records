import { Bank } from "@modules/Bank/entity/bank.entity";
import { User } from "@modules/User/entity/user.entity";
import { Transaction } from "@modules/Transaction/entity/trasaction.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account as AccountType } from "@lib/enums";

@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 20, unique: true, nullable: false })
  accountNumber: string;

  @Column("varchar", { length: 10, nullable: true })
  agency: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column("boolean", { default: true })
  isActive: boolean;

  @Column({ type: "enum", enum: AccountType, nullable: false })
  accountType: AccountType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @ManyToOne(() => Bank, (bank) => bank.accounts)
  bank: Bank;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
