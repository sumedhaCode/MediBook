import { useState } from "react";
import { mockAppointments } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Clock, X } from "lucide-react";

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(
    mockAppointments.filter((a) => a.patientId === "p1")
  );

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a))
    );
    toast.success("Appointment cancelled");
  };

  const upcoming = appointments.filter((a) => a.status === "upcoming" || a.status === "pending");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => (
    <div className="card-doctor">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{appointment.doctorName}</h3>
          <p className="text-sm text-primary">{appointment.specialization}</p>
        </div>
        <Badge variant="outline" className={statusStyles[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{appointment.date}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{appointment.time}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{appointment.type}</p>
      {appointment.status === "upcoming" && (
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button size="sm" variant="outline" onClick={() => toast.info("Reschedule feature coming soon")}>
            Reschedule
          </Button>
          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleCancel(appointment.id)}>
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted-foreground mt-1">View and manage your appointments</p>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {upcoming.map((a) => <AppointmentCard key={a.id} appointment={a} />)}
            </div>
            {upcoming.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No upcoming appointments</p>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {past.map((a) => <AppointmentCard key={a.id} appointment={a} />)}
            </div>
            {past.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No past appointments</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
