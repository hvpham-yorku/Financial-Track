import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { Config } from "./config";
import User from "./models/User";
import cors from "cors";
import AuthRoute from "./routes/auth";
import TransactionsRoute from "./routes/transactions";

const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (_, res: Response) => {
  res.send("Financial Track Server");
});

app.use("/users", AuthRoute);
app.use("/transactions", TransactionsRoute);

app.listen(Config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${Config.PORT}`);
});
