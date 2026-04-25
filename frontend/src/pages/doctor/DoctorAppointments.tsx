import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Check, X } from "lucide-react";

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/appointments/doctor")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id: number) => {
    const handleAccept = async (id: number) => {
  await API.patch(`/appointments/${id}/status`, {
    status: "upcoming",
  });
};

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "upcoming" } : a))
    );
  };

  const handleReject = async (id: number) => {
    const handleReject = async (id: number) => {
  await API.patch(`/appointments/${id}/status`, {
    status: "cancelled",
  });
};

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
  };

  const pending = appointments.filter((a) => a.status === "pending");
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const past = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  const AppointmentRow = ({ appt }: any) => (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div>
        <p className="font-medium text-foreground">
          {appt.patient?.name || "Patient"}
        </p>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {appt.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {appt.time}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className={statusStyles[appt.status]}>
          {appt.status}
        </Badge>

        {appt.status === "pending" && (
          <>
            <Button size="sm" onClick={() => handleAccept(appt.id)}>
              <Check className="h-3.5 w-3.5 mr-1" /> Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => handleReject(appt.id)}
            >
              <X className="h-3.5 w-3.5 mr-1" /> Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your patient appointments
          </p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {pending.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {upcoming.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-3">
            {past.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </TabsContent>

          {loading && <p>Loading...</p>}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}