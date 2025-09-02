import express, { Request, Response } from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

// Register
router.post(
  "/register",
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { username, email, password } = req.body;

    try {
      console.log("Register payload:", req.body); // Log payload
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({ username: username.trim(), email, password });
      const token = generateToken(user._id.toString());
      res.status(201).json({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        token,
      });
    } catch (err: any) {
      console.error("Registration error:", err); // Log detailed error
      if (err.code === 11000) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      res.status(500).json({ message: `Server error: ${err.message}` });
    }
  }
);
// Login
router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user._id.toString());
      res.json({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        token,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Me
router.get("/me", protect, async (req: Request, res: Response) => {
  res.status(200).json((req as any).user);
});

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};

export default router;