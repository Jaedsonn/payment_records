import express from 'express';
import { AppDataSource } from './shared/data-source';
import AuthRouter from '@modules/Auth/auth.routes';
import "reflect-metadata"
import ErrorHandler from "@middlewares/error";


process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", AuthRouter);
app.use(ErrorHandler.handle);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

