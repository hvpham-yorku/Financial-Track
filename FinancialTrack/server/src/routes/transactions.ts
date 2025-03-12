import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";
import { validateUser } from "../middleware";
import { UserAuthInfoRequest } from "../types";

// Adds "user" type to the express Request
import { JwtPayload } from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    user: JwtPayload;
  }
}

const TransactionsRoute = Router();

TransactionsRoute.use(validateUser);

TransactionsRoute.get("/", async (_, res: Response) => {
  res.status(404).json({ data: null, error: "Page Not Found" });
});

TransactionsRoute.get(
  "/all",
  async (req: UserAuthInfoRequest, res: Response) => {
    try {
      const userId = req.user.id as number;
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ data: null, error: "User not found" });
        return;
      }

      // Get the transactions
      const transactions = await Transaction.getTransactions(user.id);
      res.status(201).json({ data: transactions, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: "Internal server error" });
    }
  }
);

TransactionsRoute.get("/all-split", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }
    // Get the transactions
    const transactions = await Transaction.getTransactions(user.id);
    const split: {
      income: Transaction[];
      expense: Transaction[];
    } = { income: [], expense: [] };
    transactions.forEach((t) => {
      if (t.type === "income") {
        split.income.push(t);
      } else {
        split.expense.push(t);
      }
    });

    res.json({ data: split, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
  }
});

TransactionsRoute.get("/expense", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    // Get the transactions
    const expenses = await Transaction.getTransactions(user.id, "expense");
    res.json({ data: expenses, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
  }
});

TransactionsRoute.get("/income", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    // Get the transactions
    const incomes = await Transaction.getTransactions(user.id, "income");
    res.json({ data: incomes, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
  }
});

export default TransactionsRoute;
