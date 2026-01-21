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
import { env } from "@shared/env";
import swaggerUi from "swagger-ui-express"
import swaggerDoc from "swagger-jsdoc"
import * as dotenv from "dotenv";

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

const swaggerOptions = { 
  
   definition: {
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
  },
  apis: ["./src/modules/**/*.ts"],
}

const swagger = swaggerDoc(swaggerOptions);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/bank", BankRouter);
app.use("/account", AccountRouter);
app.use("/transaction", TransactionRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(ErrorHandler.handle.bind(ErrorHandler));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});


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
