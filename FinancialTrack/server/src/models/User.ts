import { db } from "../db/init";
import { DataTypes, Model } from "sequelize";

export default class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize: db,
    modelName: "User",
  }
);

User.sync();
