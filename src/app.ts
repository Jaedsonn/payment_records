import express from "express";
import { AppDataSource } from "./shared/db/data-source";
import AuthRouter from "@modules/Auth/auth.routes";
import "reflect-metadata";
import ErrorHandler from "@middlewares/error";
import { UserRouter } from "@modules/User/user.routes";
import { BankRouter } from "@modules/Bank/bank.routes";
import { AccountRouter } from "@modules/Account/account.routes";
import { TransactionRouter } from "@modules/Transaction/transaction.routes";
import cors from "cors";
import { runSeeds } from "@shared/seeds";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors()
);
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/bank", BankRouter);
app.use("/account", AccountRouter);
app.use("/transaction", TransactionRouter);
app.use(ErrorHandler.handle);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, async () => {
      console.log(`Server is running on port ${port}`);
      await runSeeds();
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
