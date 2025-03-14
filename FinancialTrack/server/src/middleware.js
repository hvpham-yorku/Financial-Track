"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const validateUser = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    jsonwebtoken_1.default.verify(token, config_1.Config.SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.validateUser = validateUser;
