import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
}

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (err) {
      console.error("Token verification failed: ", (err as Error).message);
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }
  res.status(401).json({ message: "Not authorized, token failed" });
};