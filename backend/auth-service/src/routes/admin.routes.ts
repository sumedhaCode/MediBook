import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { adminOnly, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= ADMIN STATS =================
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.count({
      where: { role: "patient" },
    });

    const doctors = await prisma.doctor.count();

    res.json({
      users,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ================= GET ALL USERS =================
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ================= GET ALL DOCTORS =================
router.get("/doctors", authMiddleware, adminOnly, async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// ================= DELETE DOCTOR (SOFT DELETE) =================
router.delete("/doctors/:id", authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ Soft delete — marks doctor as inactive instead of removing from DB
    const doctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });

    res.json({
      message: `${doctor.name} removed`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove doctor" });
  }
});

export default router;