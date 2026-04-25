import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= REGISTER =================
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // 2️⃣ If doctor → create doctor profile
    // CREATE DOCTOR PROFILE (if role = doctor)
if (role === "doctor") {
  await prisma.doctor.create({
    data: {
      userId: user.id,
      name,
      specialty: "General",
      experience: 0,
      location: "India",        // ✅ REQUIRED
      consultation: 500,        // ✅ REQUIRED (₹)
      available: true,
    },
  });
}

    // 3️⃣ Generate token
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
    console.error("REGISTER ERROR:", error);  // 🔥 IMPORTANT
    res.status(500).json({ error: "Registration failed" });
  }
});  

// ================= LOGIN =================
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
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
    res.status(500).json({ error: "Login failed" });
  }
});

// ================= GET CURRENT USER =================
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;