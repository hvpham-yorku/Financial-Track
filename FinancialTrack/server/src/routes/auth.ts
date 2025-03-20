import { Router } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import { Config } from "../config";
import jwt from "jsonwebtoken";

const AuthRoute = Router();

AuthRoute.get("/", async (_, res: Response) => {
  res.status(404).json({ data: null, error: "Page Not Found" });
  return;
});

AuthRoute.post("/register", async (req: Request, res: Response) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({
      where: { username: req.body.username },
    });
    if (existingUser) {
      res.status(400).json({ data: null, error: "Username already exists" });
      return;
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    const token = jwt.sign(
      { username: user.username, id: user.id },
      Config.SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ data: token, error: null });
    return;
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
    return;
  }
});

AuthRoute.post("/login", async (req: Request, res: Response) => {
  try {
    // Check if the email exists
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      res.status(401).json({ data: null, error: "Invalid credentials" });
      return;
    }
    if (user.password !== req.body.password) {
      res.status(401).json({ data: null, error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      Config.SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ data: token, error: null });
    return;
  } catch (error) {
    res.status(500).json({ data: null, error: "Internal server error" });
    return;
  }
});

export default AuthRoute;
