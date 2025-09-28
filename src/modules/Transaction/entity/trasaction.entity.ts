import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import {TransactionCategory, TransactionType} from "@lib/enums";
import { Account } from "@modules/Account/account.entity";

@Entity('transactions')
export class Transaction{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('decimal', {precision: 10, scale: 2, nullable: false})
  amount: number;

  @Column({ type: "enum", enum: TransactionType, nullable: false, default: TransactionType.TRANSFER })
  type: TransactionType;

  @Column({type: "enum", enum: TransactionCategory, nullable: false, default: TransactionCategory.OTHER})
  category: TransactionCategory;

  @Column('text', {nullable: true, default: null})
  description: string;

  @Column('text', {nullable: false})
  from: string;

  @Column('text', {nullable: false})
  to: string;

  @CreateDateColumn({nullable: false})
  createdAt: Date;

  @UpdateDateColumn({nullable: true, default: null})
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;
}
