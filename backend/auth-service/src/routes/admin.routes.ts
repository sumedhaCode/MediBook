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
      prisma.doctor.count({
        where: {
          isActive: true,
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

// GET ALL DOCTORS FOR ADMIN
router.get("/doctors", authMiddleware, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return res.json(doctors);
  } catch (error) {
    console.error("Admin doctors fetch error:", error);

    return res.status(500).json({
      error: "Failed to fetch doctors",
    });
  }
});

// DELETE DOCTOR FOR ADMIN - SOFT DELETE
router.delete("/doctors/:id", authMiddleware, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const doctorId = Number(req.params.id);

    if (Number.isNaN(doctorId)) {
      return res.status(400).json({
        error: "Invalid doctor id",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isActive: false,
        available: false,
      },
    });

    return res.json({
      message: "Doctor removed successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Admin doctor delete error:", error);

    return res.status(500).json({
      error: "Failed to delete doctor",
    });
  }
});

// RESTORE DOCTOR FOR ADMIN
router.patch("/doctors/:id/restore", authMiddleware, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const doctorId = Number(req.params.id);

    if (Number.isNaN(doctorId)) {
      return res.status(400).json({
        error: "Invalid doctor id",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isActive: true,
        available: true,
      },
    });

    return res.json({
      message: "Doctor restored successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Admin doctor restore error:", error);

    return res.status(500).json({
      error: "Failed to restore doctor",
    });
  }
});

export default router;