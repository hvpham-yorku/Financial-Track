"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../db/init");
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.default = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    budget: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    },
}, {
    sequelize: init_1.db,
    modelName: "User",
});
(async () => {
    await User.sync();
})();
