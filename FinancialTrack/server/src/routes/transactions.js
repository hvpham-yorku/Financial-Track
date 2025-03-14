"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const middleware_1 = require("../middleware");
const TransactionsRoute = (0, express_1.Router)();
TransactionsRoute.use(middleware_1.validateUser);
// GET ROUTES
TransactionsRoute.get("/", async (_, res) => {
    res.status(404).json({ data: null, error: "Page Not Found" });
});
TransactionsRoute.get("/all", async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if user exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ data: [], error: "User not found" });
            return;
        }
        // Get the transactions
        const transactions = await Transaction_1.default.getTransactions(user.id);
        res.status(201).json({ data: transactions, error: null });
    }
    catch (error) {
        res.status(500).json({ data: [], error: "Internal server error" });
    }
});
TransactionsRoute.get("/all-split", async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res
                .status(404)
                .json({ data: { income: [], expense: [] }, error: "User not found" });
            return;
        }
        // Get the transactions
        const transactions = await Transaction_1.default.getTransactions(user.id);
        const split = { income: [], expense: [] };
        transactions.forEach((t) => {
            if (t.type === "income") {
                split.income.push(t);
            }
            else {
                split.expense.push(t);
            }
        });
        res.json({ data: split, error: null });
    }
    catch (error) {
        res.status(500).json({
            data: { income: [], expense: [] },
            error: "Internal server error",
        });
    }
});
TransactionsRoute.get("/expense", async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ data: [], error: "User not found" });
            return;
        }
        // Get the transactions
        const expenses = await Transaction_1.default.getTransactions(user.id, "expense");
        res.json({ data: expenses, error: null });
    }
    catch (error) {
        res.status(500).json({ data: [], error: "Internal server error" });
    }
});
TransactionsRoute.get("/income", async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ data: [], error: "User not found" });
            return;
        }
        // Get the transactions
        const incomes = await Transaction_1.default.getTransactions(user.id, "income");
        res.json({ data: incomes, error: null });
    }
    catch (error) {
        res.status(500).json({ data: [], error: "Internal server error" });
    }
});
TransactionsRoute.get("/tags", async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ data: [], error: "User not found" });
            return;
        }
        // Get the transactions
        const tags = await Transaction_1.default.getTags(user.id);
        res.json({ data: tags, error: null });
    }
    catch (error) {
        res.status(500).json({ data: [], error: "Internal server error" });
    }
});
// POST ROUTES
TransactionsRoute.post("/add", async (req, res) => {
    try {
        const userId = req.user.id;
        const payload = req.body;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ data: null, error: "User not found" });
            return;
        }
        const t = await Transaction_1.default.create({ ...payload, userId });
        res.status(200).json({ data: t, error: null });
    }
    catch (error) {
        res.status(500).json({ data: null, error: "Internal server error" });
    }
});
// PATCH ROUTES
TransactionsRoute.patch("/edit", async (req, res) => {
    try {
        const userId = req.user.id;
        const payload = req.body;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        await Transaction_1.default.update({ ...payload, updated_at: new Date() }, { where: { id: payload.id, userId } });
        res.status(200).json({ error: null });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// DELETE ROUTES
TransactionsRoute.delete("/delete", async (req, res) => {
    try {
        const userId = req.user.id;
        const payload = req.body;
        // Check if exists
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const transaction = await Transaction_1.default.getTransaction(user.id, payload.id);
        if (!transaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }
        // Delete the transaction
        await transaction.destroy();
        res.status(200).json({ error: null });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = TransactionsRoute;
