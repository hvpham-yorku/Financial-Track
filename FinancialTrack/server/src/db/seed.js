"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = require("crypto");
(function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield User_1.default.sync();
        const generateRandomPassword = () => (0, crypto_1.randomBytes)(8).toString("hex");
        const users = [
            { username: "alice", password: generateRandomPassword() },
            { username: "bob", password: generateRandomPassword() },
            { username: "charlie", password: generateRandomPassword() },
            { username: "david", password: generateRandomPassword() },
            { username: "eve", password: generateRandomPassword() },
            { username: "frank", password: generateRandomPassword() },
            { username: "grace", password: generateRandomPassword() },
            { username: "heidi", password: generateRandomPassword() },
            { username: "ivan", password: generateRandomPassword() },
            { username: "judy", password: generateRandomPassword() },
        ];
        yield User_1.default.bulkCreate(users);
    });
})();
