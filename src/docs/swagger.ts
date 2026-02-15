import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { userRegistry } from "@modules/User/user.routes";
import { transactionRegistry } from "@modules/Transaction/transaction.routes";
import { bankRegister } from "@modules/Bank/bank.routes";
import { authRegistry } from "@modules/Auth/auth.routes";
import { accountRegistry } from "@modules/Account/account.routes";
import {  redisRegistry } from "@modules/redis/redis.routes";

const register = new OpenAPIRegistry([
    userRegistry,
    transactionRegistry,
    bankRegister,
    authRegistry,
    accountRegistry,
    redisRegistry
  ]);

const docs = new OpenApiGeneratorV3(register.definitions).generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Payment Records API",
      version: "0.1.0",
      description:
        "API for managing payment records, including users, banks, accounts, and transactions.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Payment Records Team",
        url: "https://paymentrecords.com",
        email: "jaedsonnm@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
})

export default docs;