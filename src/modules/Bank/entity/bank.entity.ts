import {Column, Entity, OneToMany,  PrimaryGeneratedColumn, } from "typeorm";
import { Account as AccountEntity  } from "@modules/Account/account.entity";
import { Account } from "@lib/enums";
@Entity('banks')
export class Bank{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar', {length: 100, nullable: false})
  name: string;

  @Column({ type: "enum", enum: Account, nullable: false })
  accountType: Account;

  @OneToMany(() => AccountEntity, (account) => account.bank)
  accounts: AccountEntity[];
}
