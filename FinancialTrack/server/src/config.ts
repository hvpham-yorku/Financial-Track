import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();

export class Config {
  //@ts-ignore
  public static PORT = process.env.PORT || 3000;
  //@ts-ignore
  public static SECRET = process.env.JWT_SECRET || "default_secret";
  public static DB = "src/db/financialtrack.sqlite";
  public static DB_DIALECT: Dialect = "sqlite";
}
