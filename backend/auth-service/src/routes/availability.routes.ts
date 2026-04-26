import { Router } from "express";
import prisma from "../config/prisma"; // ✅ FIXED PATH
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ================= SAVE AVAILABILITY =================
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { date, slots } = req.body;

  if (!date || !Array.isArray(slots)) {
    return res.status(400).json({ error: "Date and valid slots are required" });
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.userId! },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await prisma.availability.deleteMany({
      where: {
        doctorId: doctor.id,
        date: String(date),
      },
    });

    const data = slots.map((s: any) => ({
      doctorId: doctor.id,
      date: String(date),
      time: String(s.time),
      available: Boolean(s.available),
    }));

    await prisma.availability.createMany({ data });

    res.json({ message: "Availability saved" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save availability" });
  }
});

// ================= GET DOCTOR VIEW =================
router.get("/manage/:doctorId/:date", authMiddleware, async (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const date = String(req.params.date);

  const slots = await prisma.availability.findMany({
    where: { doctorId, date },
    orderBy: { time: "asc" },
  });

  res.json(slots);
});

// ================= GET PATIENT VIEW =================
router.get("/:doctorId/:date", async (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const date = String(req.params.date);

  const slots = await prisma.availability.findMany({
    where: {
      doctorId,
      date,
      available: true,
    },
    orderBy: { time: "asc" },
  });

  res.json(slots);
});

export default router;