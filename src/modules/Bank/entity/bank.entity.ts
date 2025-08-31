import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import { Account } from "@lib/enums";
import { User } from "@modules/User/entity/user.entity";
import {Transaction} from "@modules/Transaction/entity/trasaction.entity";

@Entity('banks')
export class Bank{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar', {length: 100, nullable: false})
  name: string;

  @Column({ type: "enum", enum: Account, nullable: false })
  account: Account;

  @Column('decimal', {precision: 10, scale: 2, default: 0, nullable: true})
  balance: number;

  @ManyToOne(() => User, (user) => user.banks)
  @JoinColumn({ name: 'user_id'})
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.bank)
  transactions: Transaction[];
}
