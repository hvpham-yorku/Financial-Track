import { Sequelize } from "sequelize";
import { Config } from "../config";

export const db = new Sequelize({
  dialect: Config.DB_DIALECT,
  storage: Config.DB,
});
