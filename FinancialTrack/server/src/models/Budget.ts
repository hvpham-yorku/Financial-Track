import { db } from "../db/init";
import { DataTypes, Model } from "sequelize";
import User from "./User";

export default class Budget extends Model {
  declare id: number;
  declare amount: number;
  declare note: string;
  declare userId: number;
  declare monthYear: string;
  declare createdAt: string;
  declare updatedAt: string;

  static getAllBudgets(userId: number) {
    return Budget.findAll({ where: { userId } });
  }

  static getBudgetById(userId: number, id: number) {
    return Budget.findOne({ where: { userId, id } });
  }
}

Budget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    monthYear: {
      type: DataTypes.STRING,
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
    sequelize: db,
    modelName: "Budget",
  }
);

(async () => {
  await Budget.sync();
})();

export type InsertBudget = {
  amount: number;
  monthYear: string;
  note: string;
};

export type UpdateBudget = {
  id: number;
  amount?: number;
  monthYear?: string;
  note?: string;
};
