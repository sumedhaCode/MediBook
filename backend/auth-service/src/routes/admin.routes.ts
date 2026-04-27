import { Router, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin auth check error:", error);

    return res.status(500).json({
      error: "Failed to verify admin",
    });
  }
};

// GET ADMIN DASHBOARD STATS
router.get("/stats", authMiddleware, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [patients, doctors, appointments] = await Promise.all([
      prisma.user.count({
        where: {
          role: "patient",
        },
      }),
      prisma.user.count({
        where: {
          role: "doctor",
        },
      }),
      prisma.appointment.count(),
    ]);

    return res.json({
      patients,
      doctors,
      appointments,
      totalUsers: patients + doctors,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return res.status(500).json({
      error: "Failed to load admin stats",
    });
  }
});

// GET ALL PATIENTS AND DOCTORS
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
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Admin users fetch error:", error);

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

export default router;