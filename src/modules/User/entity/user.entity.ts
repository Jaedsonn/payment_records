import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Bank} from "@modules/Bank/entity/bank.entity";
import { Transaction } from "@modules/Transaction/entity/trasaction.entity";

@Entity('users')
export class User{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar', {length: 100, nullable: false})
  name: string;

  @Column('varchar', {length: 100, unique: true, nullable: false})
  email: string;

  @Column('varchar', {length: 255, nullable: false})
  password: string;

  @Column('int', {nullable: false})
  age: number;
  
  @Column('decimal', {precision: 10, scale: 2, default: 0})
  balance: number;

  @OneToMany(() => Bank, (bank) => bank.user)
  banks: Bank[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

}
