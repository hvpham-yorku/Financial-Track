import { Router } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import Transaction, {
  TransactionEditBody,
  TransactionInsertBody,
} from "../models/Transaction";
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

// GET ROUTES
TransactionsRoute.get("/", async (_, res: Response) => {
  res.status(404).json({ data: null, error: "Page Not Found" });
  return;
});

TransactionsRoute.get(
  "/all",
  async (req: UserAuthInfoRequest, res: Response) => {
    try {
      const userId = req.user.id as number;
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ data: [], error: "User not found" });
        return;
      }

      // Get the transactions
      const transactions = await Transaction.getTransactions(user.id);
      res.status(201).json({ data: transactions, error: null });
      return;
    } catch (error) {
      res.status(500).json({ data: [], error: "Internal server error" });
      return;
    }
  }
);

TransactionsRoute.get(
  "/month/:month",
  async (req: UserAuthInfoRequest, res: Response) => {
    try {
      const userId = req.user.id as number;
      const month = req.params.month;
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ data: [], error: "User not found" });
        return;
      }

      // Get the transactions
      const transactions = await Transaction.getTransactionsByMonth(
        user.id,
        month
      );
      res.status(201).json({ data: transactions, error: null });
      return;
    } catch (error) {
      res.status(500).json({ data: [], error: "Internal server error" });
      return;
    }
  }
);
TransactionsRoute.get(
  "/week/:date",
  async (req: UserAuthInfoRequest, res: Response) => {
    try {
      const userId = req.user.id as number;
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ data: [], error: "User not found" });
        return;
      }

      // Get the transactions
      const transactions = await Transaction.getTransactionsByWeek(
        user.id,
        new Date(req.params.date)
      );
      res.status(201).json({ data: transactions, error: null });
      return;
    } catch (error) {
      res.status(500).json({ data: [], error: "Internal server error" });
      return;
    }
  }
);

TransactionsRoute.get("/all-split", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res
        .status(404)
        .json({ data: { income: [], expense: [] }, error: "User not found" });
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
    return;
  } catch (error: any) {
    res.status(500).json({
      data: { income: [], expense: [] },
      error: "Internal server error: " + error.message,
    });
    return;
  }
});

TransactionsRoute.get("/expense", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: [], error: "User not found" });
      return;
    }

    // Get the transactions
    const expenses = await Transaction.getTransactions(user.id, "expense");
    res.json({ data: expenses, error: null });
  } catch (error) {
    res.status(500).json({ data: [], error: "Internal server error" });
  }
});

TransactionsRoute.get("/income", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: [], error: "User not found" });
      return;
    }

    // Get the transactions
    const incomes = await Transaction.getTransactions(user.id, "income");
    res.json({ data: incomes, error: null });
  } catch (error) {
    res.status(500).json({ data: [], error: "Internal server error" });
  }
});

TransactionsRoute.get("/tags", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: [], error: "User not found" });
      return;
    }

    // Get the transactions
    const tags = await Transaction.getTags(user.id);
    res.json({ data: tags, error: null });
  } catch (error) {
    res.status(500).json({ data: [], error: "Internal server error" });
  }
});

TransactionsRoute.get(
  "/:id",
  async (req: UserAuthInfoRequest, res: Response) => {
    try {
      const userId = req.user.id as number;
      const transactionId = Number(req.params.id);
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ data: null, error: "User not found" });
        return;
      }

      // Get the transactions
      const transaction = await Transaction.getTransaction(
        user.id,
        transactionId
      );
      res.status(201).json({ data: transaction, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: "Internal server error" });
    }
  }
);

// POST ROUTES
TransactionsRoute.post("/add", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const payload = req.body as TransactionInsertBody;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    const t = await Transaction.create({ ...payload, userId });
    res.status(200).json({ data: t, error: null });
  } catch (error: any) {
    res
      .status(500)
      .json({ data: null, error: "Internal server error: " + error.message });
  }
});

// PATCH ROUTES
TransactionsRoute.patch("/edit", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const payload = req.body as TransactionEditBody;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await Transaction.update(
      { ...payload, updated_at: new Date() },
      { where: { id: payload.id, userId } }
    );
    res.status(200).json({ error: null });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE ROUTES
TransactionsRoute.delete("/delete", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const payload = req.body as TransactionEditBody;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const transaction = await Transaction.getTransaction(user.id, payload.id);
    if (!transaction) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    // Delete the transaction
    await transaction.destroy();
    res.status(200).json({ error: null });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

export default TransactionsRoute;
