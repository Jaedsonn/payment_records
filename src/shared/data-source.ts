import typeorm = require("typeorm");
import { Bank } from '@modules/Bank/entity/bank.entity';
import { User } from '@modules/User/entity/user.entity';
import { Transaction } from '@modules/Transaction/entity/trasaction.entity';

process.loadEnvFile()

export const AppDataSource = new typeorm.DataSource({
  type: "postgres",
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: true,
  entities: [User, Bank, Transaction],
  subscribers: [],
  migrations: [],
})
