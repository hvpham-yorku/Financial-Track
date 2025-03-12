import { db } from "../db/init";
import { DataTypes, Model } from "sequelize";
import User from "./User";

export default class Transaction extends Model {
  declare id: number;
  declare amount: number;
  declare title: string;
  declare tag: string | null;
  declare type: "income" | "expense";
  declare createdAt: Date;
  declare updatedAt: Date;
  declare userId: number;

  public static getTransactions(
    userId: number,
    type?: "income" | "expense"
  ): Promise<Transaction[]> {
    return !type
      ? Transaction.findAll({ where: { userId } })
      : Transaction.findAll({ where: { userId, type } });
  }
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    // Other model options go here
    sequelize: db,
    modelName: "Transaction",
  }
);

(async () => {
  await Transaction.sync();
})();
