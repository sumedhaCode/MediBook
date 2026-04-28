import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

const FREEZE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// POST /api/freeze
// Body: { doctorId, date, time }
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { doctorId, date, time } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        error: "doctorId, date and time are required",
      });
    }

    const parsedDoctorId = Number(doctorId);

    if (Number.isNaN(parsedDoctorId)) {
      return res.status(400).json({
        error: "Invalid doctorId",
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + FREEZE_DURATION_MS);

    // 1. Check if appointment already exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: parsedDoctorId,
        date,
        time,
        status: {
          not: "cancelled",
        },
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        error: "Slot already booked",
        code: "SLOT_ALREADY_BOOKED",
      });
    }

    // 2. Check if availability exists and is still available
    const availability = await prisma.availability.findUnique({
      where: {
        unique_doctor_slot_availability: {
          doctorId: parsedDoctorId,
          date,
          time,
        },
      },
    });

    if (!availability || !availability.available) {
      return res.status(409).json({
        error: "Slot is not available",
        code: "SLOT_NOT_AVAILABLE",
      });
    }

    // 3. Check if slot is already frozen
    const existingFreeze = await prisma.slotFreeze.findUnique({
      where: {
        unique_doctor_slot_freeze: {
          doctorId: parsedDoctorId,
          date,
          time,
        },
      },
    });

    if (existingFreeze) {
      const isExpired = existingFreeze.expiresAt <= now;
      const isOwnFreeze = existingFreeze.userId === req.userId;

      if (!isExpired && !isOwnFreeze) {
        const secondsLeft = Math.ceil(
          (existingFreeze.expiresAt.getTime() - now.getTime()) / 1000
        );

        return res.status(423).json({
          error: "Slot is temporarily held by another user",
          code: "SLOT_FROZEN",
          secondsLeft,
        });
      }
    }

    // 4. Create or refresh freeze
    const freeze = await prisma.slotFreeze.upsert({
      where: {
        unique_doctor_slot_freeze: {
          doctorId: parsedDoctorId,
          date,
          time,
        },
      },
      update: {
        userId: req.userId,
        expiresAt,
      },
      create: {
        doctorId: parsedDoctorId,
        date,
        time,
        userId: req.userId,
        expiresAt,
      },
    });

    return res.status(200).json({
      message: "Slot frozen successfully",
      freeze: {
        doctorId: freeze.doctorId,
        date: freeze.date,
        time: freeze.time,
        expiresAt: freeze.expiresAt,
      },
    });
  } catch (error: any) {
    console.error("Freeze slot error:", error);

    if (error.code === "P2002") {
      return res.status(423).json({
        error: "Slot is temporarily held by another user",
        code: "SLOT_FROZEN",
      });
    }

    return res.status(500).json({
      error: "Failed to freeze slot",
    });
  }
});

// DELETE /api/freeze
// Body: { doctorId, date, time }
router.delete("/", authMiddleware, async (req: AuthRequest, res) => {
  const { doctorId, date, time } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        error: "doctorId, date and time are required",
      });
    }

    const parsedDoctorId = Number(doctorId);

    if (Number.isNaN(parsedDoctorId)) {
      return res.status(400).json({
        error: "Invalid doctorId",
      });
    }

    const freeze = await prisma.slotFreeze.findUnique({
      where: {
        unique_doctor_slot_freeze: {
          doctorId: parsedDoctorId,
          date,
          time,
        },
      },
    });

    if (freeze && freeze.userId === req.userId) {
      await prisma.slotFreeze.delete({
        where: {
          unique_doctor_slot_freeze: {
            doctorId: parsedDoctorId,
            date,
            time,
          },
        },
      });
    }

    return res.status(200).json({
      message: "Freeze released",
    });
  } catch (error) {
    console.error("Release freeze error:", error);

    return res.status(500).json({
      error: "Failed to release freeze",
    });
  }
});

export default router;