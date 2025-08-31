import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { User } from "@modules/User/entity/user.entity";
import { Bank } from "@modules/Bank/entity/bank.entity";
import {TransactionType} from "@lib/enums";

@Entity('transactions')
export class Transaction{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('decimal', {precision: 10, scale: 2, nullable: false})
  amount: number;

  @Column({ type: "enum", enum: TransactionType, nullable: false, default: TransactionType.TRANSFER })
  type: TransactionType;

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

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bank, bank => bank.transactions)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;
}
