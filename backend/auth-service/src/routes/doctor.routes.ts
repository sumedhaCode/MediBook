import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= GET ALL DOCTORS =================
router.get("/", async (req, res) => {
  try {
    // ✅ Only return active doctors (soft delete filter)
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// ================= CREATE DOCTOR =================
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { name, specialty, experience, location, consultation } = req.body;

  try {
    const doctor = await prisma.doctor.create({
      data: {
        userId: req.userId!,
        name,
        specialty,
        experience,
        location,
        consultation,
      },
    });

    res.json({
      message: "Doctor created",
      doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

// ================= SEARCH DOCTORS =================
router.get("/search", async (req, res) => {
  const { specialty } = req.query;

  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        specialty: {
          contains: String(specialty),
        },
      },
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ================= UPDATE AVAILABILITY (SECURE) =================
router.patch("/availability", authMiddleware, async (req: AuthRequest, res) => {
  const { available } = req.body;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.userId! },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: { available },
    });

    res.json({
      message: "Availability updated",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update availability" });
  }
});

export default router;