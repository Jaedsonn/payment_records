import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account as AccountEntity } from "@modules/Account/entity/account.entity";

@Entity("banks")
export class Bank {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  name: string;

  @Column("varchar", { length: 10, nullable: true })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AccountEntity, (account) => account.bank)
  accounts: AccountEntity[];
}
