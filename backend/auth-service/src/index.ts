import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import "dotenv/config";
import doctorRoutes from "./routes/doctor.routes";
import appointmentRoutes from "./routes/appointment.routes";
import availabilityRoutes from "./routes/availability.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/availability", availabilityRoutes);
app.use("/api/admin", adminRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});