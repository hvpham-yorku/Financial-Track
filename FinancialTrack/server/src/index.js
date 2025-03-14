"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get("/", async (_, res) => {
    res.send("Financial Track Server");
});
app.use("/users", users_1.default);
app.use("/auth", auth_1.default);
app.use("/transactions", transactions_1.default);
app.listen(config_1.Config.PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${config_1.Config.PORT}`);
});
