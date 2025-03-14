import { db } from "../db/init";
import { DataTypes, Model } from "sequelize";
import User from "./User";

export default class Budget extends Model {
  declare id: number;
  declare userId: number;
  declare amount: number;
  declare startDate: Date;
  declare endDate: Date;
  declare period: "monthly" | "weekly";  // Defines the period of the budget (monthly or weekly)
}

Budget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    period: {
      type: DataTypes.ENUM("monthly", "weekly"),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Budget",
  }
);

(async () => {
  await Budget.sync();  // Ensures the model is created in the database
})();
