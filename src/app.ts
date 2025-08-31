import express from 'express';
import { AppDataSource } from './shared/data-source';

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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


app.get("/", (req, res) =>{
  res.send("Hello World!");
})

