import { Router } from "express";
import prisma from "../config/prisma";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// BOOK APPOINTMENT
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

    const appointment = await prisma.$transaction(async (tx) => {
      // Atomically mark slot unavailable ONLY if it is still available.
      // If two patients book at same time, only one request can update this row.
      const slotUpdate = await tx.availability.updateMany({
        where: {
          doctorId: parsedDoctorId,
          date,
          time,
          available: true,
        },
        data: {
          available: false,
        },
      });

      // count = 0 means slot is already unavailable or does not exist
      if (slotUpdate.count !== 1) {
        throw new Error("SLOT_ALREADY_BOOKED");
      }

      // Create appointment inside the same transaction
      const createdAppointment = await tx.appointment.create({
        data: {
          userId: req.userId!,
          doctorId: parsedDoctorId,
          date,
          time,
          status: "pending",
        },
      });

      return createdAppointment;
    });

    return res.status(201).json({
      message: "Booked",
      appointment,
    });
  } catch (error: any) {
    console.error("Book appointment error:", error);

    if (error.message === "SLOT_ALREADY_BOOKED") {
      return res.status(409).json({
        error: "Slot already booked. Please refresh slots.",
        code: "SLOT_ALREADY_BOOKED",
      });
    }

    // Prisma unique constraint error from @@unique([doctorId, date, time])
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Slot already booked. Please refresh slots.",
        code: "SLOT_ALREADY_BOOKED",
      });
    }

    return res.status(500).json({
      error: "Failed to book appointment",
    });
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

    return res.json(appointments);
  } catch (error) {
    console.error("Fetch my appointments error:", error);

    return res.status(500).json({
      error: "Failed to fetch appointments",
    });
  }
});

// GET DOCTOR APPOINTMENTS (SECURE)
router.get("/doctor", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        userId: req.userId!,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json(appointments);
  } catch (error) {
    console.error("Fetch doctor appointments error:", error);

    return res.status(500).json({
      error: "Failed to fetch doctor appointments",
    });
  }
});

// UPDATE APPOINTMENT STATUS
router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        userId: req.userId!,
      },
    });

    if (!doctor) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    return res.json({
      message: "Status updated",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      error: "Failed to update status",
    });
  }
});

export default router;