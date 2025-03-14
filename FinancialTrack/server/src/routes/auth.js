"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthRoute = (0, express_1.Router)();
AuthRoute.get("/", async (_, res) => {
    res.status(404).json({ data: null, error: "Page Not Found" });
});
AuthRoute.post("/register", async (req, res) => {
    try {
        // Check if the email already exists
        const existingUser = await User_1.default.findOne({
            where: { username: req.body.username },
        });
        if (existingUser) {
            res.status(400).json({ data: null, error: "Username already exists" });
            return;
        }
        const user = await User_1.default.create({
            username: req.body.username,
            password: req.body.password,
        });
        const token = jsonwebtoken_1.default.sign({ username: user.username, id: user.id }, config_1.Config.SECRET, { expiresIn: "7d" });
        res.status(201).json({ data: token, error: null });
    }
    catch (error) {
        res.status(500).json({ data: null, error: "Internal server error" });
    }
});
AuthRoute.post("/login", async (req, res) => {
    try {
        // Check if the email exists
        const user = await User_1.default.findOne({ where: { username: req.body.username } });
        if (!user) {
            res.status(401).json({ data: null, error: "Invalid credentials" });
            return;
        }
        if (user.password !== req.body.password) {
            res.status(401).json({ data: null, error: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ username: user.username, id: user.id }, config_1.Config.SECRET, { expiresIn: "7d" });
        res.status(200).json({ data: token, error: null });
    }
    catch (error) {
        res.status(500).json({ data: null, error: "Internal server error" });
    }
});
exports.default = AuthRoute;
