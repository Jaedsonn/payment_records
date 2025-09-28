import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Account } from "@modules/Account/account.entity";

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
  
  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
