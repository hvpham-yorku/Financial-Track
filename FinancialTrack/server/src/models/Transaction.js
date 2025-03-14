"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../db/init");
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("./User"));
class Transaction extends sequelize_1.Model {
    static getTransaction(userId, tId) {
        return Transaction.findOne({ where: { userId, id: tId } });
    }
    static getTransactions(userId, type) {
        return !type
            ? Transaction.findAll({ where: { userId } })
            : Transaction.findAll({ where: { userId, type } });
    }
    static async getTags(userId) {
        return Transaction.findAll({
            where: {
                userId,
            },
        }).then((transactions) => Array.from(new Set(transactions
            .map((t) => t.getDataValue("tag"))
            .filter((tag) => tag !== null))));
    }
}
exports.default = Transaction;
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("income", "expense"),
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.default,
            key: "id",
        },
    },
}, {
    // Other model options go here
    sequelize: init_1.db,
    modelName: "Transaction",
});
(async () => {
    await Transaction.sync();
})();
