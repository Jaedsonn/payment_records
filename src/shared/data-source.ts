import typeorm = require("typeorm");

export const AppDataSource = new typeorm.DataSource({
  type: "sqlite",
  database: "src/shared/payment_records.sqlite",
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
})
