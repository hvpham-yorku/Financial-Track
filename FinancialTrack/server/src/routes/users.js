"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const middleware_1 = require("../middleware");
const UserRoute = (0, express_1.Router)();
// DEV ENV
UserRoute.get("/", async (_, res) => {
    const users = await User_1.default.findAll();
    res.json(users);
});
UserRoute.use(middleware_1.validateUser);
// GET BUDGET
UserRoute.get("/budget", async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if user exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ data: null, error: "User not found" });
            return;
        }
        res.status(201).json({ data: { budget: user.budget }, error: null });
    }
    catch (error) {
        res.status(500).json({ data: null, error: "Internal server error" });
    }
});
exports.default = UserRoute;
