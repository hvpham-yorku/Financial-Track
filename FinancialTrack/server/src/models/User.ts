import { db } from "../db/init";
import { DataTypes, Model } from "sequelize";

export default class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare budget: number;
  declare createdAt: string;
  declare updatedAt: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    sequelize: db,
    modelName: "User",
  }
);

(async () => {
  await User.sync();
})();
