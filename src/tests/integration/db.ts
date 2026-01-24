import * as typeorm from "typeorm";
import { Bank } from "@modules/Bank/entity/bank.entity";
import { User } from "@modules/User/entity/user.entity";
import { Transaction } from "@modules/Transaction/entity/trasaction.entity";
import { Account } from "@modules/Account/entity/account.entity";
import { env } from "@shared/env";
import * as dotenv from "dotenv";

dotenv.config();

export const TestAppDataSource = new typeorm.DataSource({
  type: "postgres",
  database: env.DB_DATABASE + "_test",
  host: env.DB_HOST,
  port: 5433,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  synchronize: true,
  logging: true,
  entities: [User, Bank, Transaction, Account],
  subscribers: [],
  migrations: [],
});