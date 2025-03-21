import { Router } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { validateUser } from "../middleware";

// Adds "user" type to the express Request
declare module "express-serve-static-core" {
  interface Request {
    user: jwt.JwtPayload;
  }
}

const UserRoute = Router();
UserRoute.use(validateUser);

// DEV ENV
UserRoute.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    res.status(201).json({
      data: {
        username: user.username,
        budget: user.budget,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
      error: null,
    });
    return;
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
    return;
  }
});

// GET BUDGET
UserRoute.get("/budget", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }

    res.status(201).json({ data: { budget: user.budget }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
  }
});

export default UserRoute;
