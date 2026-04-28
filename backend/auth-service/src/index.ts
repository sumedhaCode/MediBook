import express from "express";
import cors from "cors";
import "dotenv/config";

import prisma from "./config/prisma";

import authRoutes from "./routes/auth.routes";
import doctorRoutes from "./routes/doctor.routes";
import appointmentRoutes from "./routes/appointment.routes";
import availabilityRoutes from "./routes/availability.routes";
import adminRoutes from "./routes/admin.routes";
import freezeRoutes from "./routes/freeze.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/freeze", freezeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

// Cleanup expired slot freezes every 2 minutes
setInterval(async () => {
  try {
    await prisma.slotFreeze.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Expired freeze cleanup error:", error);
  }
}, 2 * 60 * 1000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});