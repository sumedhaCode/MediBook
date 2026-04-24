import DashboardLayout from "@/components/DashboardLayout";
import { mockAppointments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function AllAppointments() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Appointments</h1>
          <p className="text-muted-foreground mt-1">{mockAppointments.length} total appointments</p>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.patientName}</TableCell>
                  <TableCell>{appt.doctorName}</TableCell>
                  <TableCell className="text-muted-foreground">{appt.specialization}</TableCell>
                  <TableCell className="text-muted-foreground">{appt.date}</TableCell>
                  <TableCell className="text-muted-foreground">{appt.time}</TableCell>
                  <TableCell className="text-muted-foreground">{appt.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[appt.status]}>{appt.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
