"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../db/init");
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.default = User;
User.init({
    // Model attributes are defined here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    // Other model options go here
    sequelize: init_1.db,
    modelName: "User",
});
User.sync();
