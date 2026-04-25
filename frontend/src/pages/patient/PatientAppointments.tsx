import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";

interface Appointment {
  id: number;
  date: string;
  status: string;
  doctor: {
    name: string;
    specialty?: string;
  };
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(res.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Appointments
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your appointments
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          /* EMPTY STATE */
          <p>No appointments yet</p>
        ) : (
          /* REAL DATA */
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">
                {appt.doctor?.name || "Unknown Doctor"}
              </h3>

              {appt.doctor?.specialty && (
                <p className="text-sm text-muted-foreground">
                  {appt.doctor.specialty}
                </p>
              )}

              <div className="mt-2 text-sm">
                <p>
                  <strong>Date:</strong> {appt.date}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{appt.status}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}