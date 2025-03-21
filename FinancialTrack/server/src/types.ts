import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserAuthInfoRequest extends Request {
  user: JwtPayload;
}
