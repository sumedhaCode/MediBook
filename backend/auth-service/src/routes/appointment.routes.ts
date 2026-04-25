import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// BOOK APPOINTMENT
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { doctorId, date, time } = req.body;

  try {
    // ❌ prevent double booking
    const exists = await prisma.appointment.findFirst({
      where: { doctorId, date, time },
    });

    if (exists) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.userId!,
        doctorId,
        date,
        time,
      },
    });

    // 🔥 BLOCK SLOT AFTER BOOKING
    await prisma.availability.updateMany({
      where: {
        doctorId,
        date,
        time,
      },
      data: { available: false },
    });

    res.json({ message: "Booked", appointment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});
// GET MY APPOINTMENTS (PATIENT)
router.get("/my", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: req.userId!,
      },
      include: {
        doctor: true,
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// GET DOCTOR APPOINTMENTS (SECURE)
router.get("/doctor", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.userId! },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        user: true,
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctor appointments" });
  }
});

// UPDATE APPOINTMENT STATUS
router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.userId! },
    });

    if (!doctor) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id),
      },
      data: { status },
    });

    res.json({
      message: "Status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;