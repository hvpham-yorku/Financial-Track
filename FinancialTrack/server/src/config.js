"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Config {
    static PORT = process.env.PORT || 3000;
    static SECRET = process.env.JWT_SECRET;
    static DB = "src/db/financialtrack.sqlite";
    static DB_DIALECT = "sqlite";
}
exports.Config = Config;
