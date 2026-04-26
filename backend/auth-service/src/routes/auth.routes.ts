import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= REGISTER =================
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role, specialty, experience, location, consultation } = req.body;

  try {
    // 🚫 BLOCK ADMIN SIGNUP
    if (role === "admin") {
      return res.status(403).json({ error: "Admin registration not allowed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "doctor") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name,
          specialty,
          experience,
          location,
          consultation,
          available: true,
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ================= LOGIN =================
// ================= LOGIN =================
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log("LOGIN_ATTEMPT:", { email });

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("LOGIN_USER_FOUND:", Boolean(user));

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("LOGIN_PASSWORD_MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({
        error: "Server configuration error",
        details: "JWT_SECRET is missing",
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR_DEBUG:", error);

    return res.status(500).json({
      error: "Login failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// ================= GET CURRENT USER =================
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;