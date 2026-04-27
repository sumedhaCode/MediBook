import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

const requireAdmin = async (req: AuthRequest, res: any, next: any) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ error: "Failed to verify admin" });
  }
};

// GET ALL USERS FOR ADMIN
router.get("/users", authMiddleware, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["patient", "doctor"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        doctor: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

export default router;