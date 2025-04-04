import { Router } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import { validateUser } from "../middleware";

const UserRoute = Router();

// Adds "user" type to the express Request
import { JwtPayload } from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    user: JwtPayload;
  }
}

UserRoute.use(validateUser);

UserRoute.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as number;
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ data: null, error: "User not found" });
      return;
    }
    res.status(201).json({ data: { username: user.username }, error: null });
    return;
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
    return;
  }
});

export default UserRoute;
