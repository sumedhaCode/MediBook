import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= SAVE AVAILABILITY =================
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { date, slots } = req.body;

  if (!date || !slots) {
    return res.status(400).json({ error: "Date and slots are required" });
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.userId! },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await prisma.availability.deleteMany({
      where: { doctorId: doctor.id, date },
    });

    const data = slots.map((s: any) => ({
      doctorId: doctor.id,
      date,
      time: s.time,
      available: s.available,
    }));

    await prisma.availability.createMany({ data });

    res.json({ message: "Availability saved" });

  } catch (error) {
    console.error("SAVE AVAILABILITY ERROR:", error);
    res.status(500).json({ error: "Failed to save availability" });
  }
});

// ================= GET ALL SLOTS (DOCTOR EDIT VIEW) =================
// Returns ALL slots (available + unavailable) so doctor can toggle them
router.get("/manage/:doctorId/:date", authMiddleware, async (req: AuthRequest, res) => {
  const { doctorId, date } = req.params;

  try {
    const slots = await prisma.availability.findMany({
      where: {
        doctorId: Number(doctorId),
        date,
        // ✅ NO available filter — doctor needs to see all slots
      },
      orderBy: { time: "asc" },
    });

    res.json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

// ================= GET AVAILABLE SLOTS (PATIENT BOOKING VIEW) =================
// Returns ONLY available: true slots for patient to book
router.get("/:doctorId/:date", async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const slots = await prisma.availability.findMany({
      where: {
        doctorId: Number(doctorId),
        date,
        available: true, // ✅ patient only sees bookable slots
      },
      orderBy: { time: "asc" },
    });

    res.json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

export default router;