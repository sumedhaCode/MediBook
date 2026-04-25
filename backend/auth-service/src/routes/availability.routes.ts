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

    // 🔥 Delete old slots for that date
    await prisma.availability.deleteMany({
      where: {
        doctorId: doctor.id,
        date,
      },
    });

    // 🔥 Insert new slots
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

// ================= GET AVAILABILITY =================
// ✅ Uses doctorId directly, filters only available: true slots
router.get("/:doctorId/:date", async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const slots = await prisma.availability.findMany({
      where: {
        doctorId: Number(doctorId),
        date,
        available: true, // 🔥 only available slots
      },
      orderBy: {
        time: "asc",
      },
    });

    res.json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

export default router;