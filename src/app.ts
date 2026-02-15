import express from "express";
import { AppDataSource } from "./shared/db/data-source";
import AuthRouter from "@modules/Auth/auth.routes";
import "reflect-metadata";
import ErrorHandler from "@middlewares/error";
import { UserRouter } from "@modules/User/user.routes";
import { BankRouter } from "@modules/Bank/bank.routes";
import { AccountRouter } from "@modules/Account/account.routes";
import { TransactionRouter } from "@modules/Transaction/transaction.routes";
import { redisRouter } from "@modules/redis/redis.routes";
import { loggerMiddleware } from "@middlewares/loggger.middleware";
import cors from "cors";
import { runSeeds } from "@shared/seeds";
import { env } from "@shared/env";
import swaggerUi from "swagger-ui-express"
import docs from "docs/swagger";
import * as dotenv from "dotenv";
import { redisClient } from "@modules/redis/redis.config";

dotenv.config();

const app = express();
const port = env.PORT || 3000;

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/bank", BankRouter);
app.use("/account", AccountRouter);
app.use("/transaction", TransactionRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(docs));
app.use("/redis", redisRouter);
app.use(ErrorHandler.handle.bind(ErrorHandler));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});


AppDataSource.initialize()
  .then(() => {
    redisClient.connect().then(() => {
      app.listen(port, async () => {
        await runSeeds();
      });
    })
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
