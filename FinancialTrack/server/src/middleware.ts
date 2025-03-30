import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Config } from "./config";
import { UserAuthInfoRequest } from "./types";

export const validateUser = (
  req: UserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  jwt.verify(token, Config.SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.user = decoded as jwt.JwtPayload;
    next();
    return;
  });
  return;
};
