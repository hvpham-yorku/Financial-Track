import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { Config } from "./config";
import User from "./models/User";
import cors from "cors";

const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (_, res: Response) => {
  res.send("Financial Track Server");
});

app.get("/users", async (_, res: Response) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.create({ username, password });
  res.json(user);
});

app.listen(Config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${Config.PORT}`);
});
