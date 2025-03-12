import { Router } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import { Config } from "../config";
import jwt from "jsonwebtoken";

const AuthRoute = Router();

AuthRoute.get("/", async (_, res: Response) => {
  res.status(404).json({ data: null, error: "Page Not Found" });
});

AuthRoute.post("/register", async (req: Request, res: Response) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({
      where: { username: req.body.username },
    });
    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
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
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

AuthRoute.post("/login", async (req: Request, res: Response) => {
  try {
    // Check if the email exists
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (user.password !== req.body.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      Config.SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default AuthRoute;
