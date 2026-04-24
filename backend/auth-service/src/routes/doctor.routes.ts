import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

// GET ALL DOCTORS
router.get("/", async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

export default router;
// CREATE DOCTOR
router.post("/", authMiddleware, async (req, res) => {
  const { name, specialty, experience } = req.body;

  try {
    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty,
        experience
      }
    });

    res.json({
      message: "Doctor created",
      doctor
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

// SEARCH DOCTORS BY SPECIALTY
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
// UPDATE DOCTOR AVAILABILITY
router.patch("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    const doctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: { available },
    });

    res.json({
      message: "Availability updated",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update availability" });
  }
});