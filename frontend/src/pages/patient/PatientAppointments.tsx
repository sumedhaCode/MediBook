import { useEffect, useState, useCallback } from "react";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await API.get("/appointments/my");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(fetchAppointments, 5000);

    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const pending = appointments.filter((a) => a.status === "pending");

  const upcoming = appointments.filter((a) => a.status === "upcoming");

  const past = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  const Card = ({ appt }: any) => (
    <div className="p-4 border rounded-lg mb-3">
      <h3 className="font-semibold">{appt.doctor?.name || "Doctor"}</h3>

      <p className="text-sm text-muted-foreground">
        {appt.doctor?.specialty || "Specialty not available"}
      </p>

      <p className="text-sm mt-2">
        {appt.date} • {appt.time}
      </p>

      <p className="text-sm mt-1 capitalize">
        Status: <strong>{appt.status}</strong>
      </p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>

            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>

            <TabsTrigger value="past">
              Past ({past.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <TabsContent value="pending">
                {pending.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending</p>
                ) : (
                  pending.map((a) => <Card key={a.id} appt={a} />)
                )}
              </TabsContent>

              <TabsContent value="upcoming">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming</p>
                ) : (
                  upcoming.map((a) => <Card key={a.id} appt={a} />)
                )}
              </TabsContent>

              <TabsContent value="past">
                {past.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No past</p>
                ) : (
                  past.map((a) => <Card key={a.id} appt={a} />)
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}