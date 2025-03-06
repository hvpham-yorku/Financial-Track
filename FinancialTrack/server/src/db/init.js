"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
exports.db = new sequelize_1.Sequelize({
    dialect: config_1.Config.DB_DIALECT,
    storage: config_1.Config.DB,
});
