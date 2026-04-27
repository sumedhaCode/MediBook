import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= REGISTER =================
router.post("/register", async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role,
    specialty,
    experience,
    location,
    consultation,
  } = req.body;

  try {
    // 🚫 BLOCK ADMIN SIGNUP
    if (role === "admin") {
      return res.status(403).json({
        error: "Admin registration not allowed",
      });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Name, email, password and role are required",
      });
    }

    if (role !== "patient" && role !== "doctor") {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    if (role === "doctor") {
      if (!specialty || !experience || !location || !consultation) {
        return res.status(400).json({
          error:
            "Specialty, experience, location and consultation are required for doctor signup",
        });
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });

      if (role === "doctor") {
        await tx.doctor.create({
          data: {
            userId: createdUser.id,
            name,
            specialty: String(specialty).trim(),
            experience: Number(experience),
            location: String(location).trim(),
            consultation: Number(consultation),
            rating: 4.5,
            available: true,
            isActive: true,
          },
        });
      }

      return createdUser;
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// ================= SEED ADMIN - TEMPORARY =================
router.post("/seed-admin", async (req: Request, res: Response) => {
  try {
    const { secret } = req.body;

    if (!process.env.ADMIN_SEED_SECRET) {
      return res.status(500).json({
        error: "ADMIN_SEED_SECRET is not configured",
      });
    }

    if (secret !== process.env.ADMIN_SEED_SECRET) {
      return res.status(403).json({
        error: "Invalid seed secret",
      });
    }

    const email = process.env.ADMIN_EMAIL || "admin@medibook.com";
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      return res.status(500).json({
        error: "ADMIN_PASSWORD is not configured",
      });
    }

    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "admin",
      },
    });

    if (existingAdmin && existingAdmin.email !== email) {
      return res.status(409).json({
        error: "An admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name: "Admin",
        password: hashedPassword,
        role: "admin",
      },
      create: {
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return res.json({
      message: "Admin account ready",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Seed admin error:", error);

    return res.status(500).json({
      error: "Failed to seed admin",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

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
      where: {
        email,
      },
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
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("GET_ME_ERROR:", error);

    return res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

export default router;