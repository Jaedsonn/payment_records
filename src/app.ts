import express from 'express';
import { AppDataSource } from './shared/data-source';
import AuthRouter from '@modules/Auth/auth.routes';
import "reflect-metadata"


process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", AuthRouter);

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

