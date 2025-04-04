import { Router } from "express";
import { Request, Response } from "express";
import { validateUser } from "../middleware";
import User from "../models/User";
import Budget, { InsertBudget, UpdateBudget } from "../models/Budget";
import { dateToMonthYear } from "../utils/helpers";

const BudgetRoute = Router();

BudgetRoute.use(validateUser);

// GET ROUTES
BudgetRoute.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: [], error: "User not found" });
      return;
    }

    // Get the transactions
    const budgets = await Budget.getAllBudgets(userId);
    const now = dateToMonthYear(new Date());
    const filtered = budgets.filter((b) => b.monthYear === now);
    res.status(201).json({ data: filtered, error: null });
    return;
  } catch (error) {
    res.status(500).json({ data: [], error: "Internal server error" });
    return;
  }
});

BudgetRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const budgetId = Number(req.params.id);
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    // Get the transactions
    const budget = await Budget.getBudgetById(userId, budgetId);
    res.status(201).json({ data: budget, error: null });
    return;
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
    return;
  }
});

//POST
BudgetRoute.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const payload = req.body as InsertBudget;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    const t = await Budget.create({
      ...payload,
      monthYear: payload.monthYear,
      userId,
    });
    res.status(200).json({ data: t, error: null });
  } catch (error: any) {
    res
      .status(500)
      .json({ data: null, error: "Internal server error: " + error.message });
  }
});

//PATCH
BudgetRoute.patch("/edit", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const payload = req.body as UpdateBudget;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    payload.monthYear
      ? await Budget.update(
          {
            ...payload,
            monthYear: payload.monthYear,
            updated_at: new Date(),
          },
          { where: { id: payload.id, userId } }
        )
      : await Budget.update(
          { ...payload, updated_at: new Date() },
          { where: { id: payload.id, userId } }
        );
    res.status(200).json({ error: null });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//DELETE
BudgetRoute.delete("/delete", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    const payload = req.body as UpdateBudget;
    // Check if exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const budget = await Budget.getBudgetById(user.id, payload.id);
    if (!budget) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }

    // Delete the budget
    await budget.destroy();
    res.status(200).json({ error: null });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

export default BudgetRoute;
