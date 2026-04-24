import DashboardLayout from "@/components/DashboardLayout";
import { mockAppointments, mockDoctors, mockUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: String(mockUsers.length), icon: Users, color: "text-primary" },
    { label: "Total Doctors", value: String(mockDoctors.length), icon: Stethoscope, color: "text-primary" },
    { label: "Appointments", value: String(mockAppointments.length), icon: Calendar, color: "text-warning" },
    { label: "Revenue", value: "$12,450", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of the platform</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAppointments.slice(0, 5).map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-foreground">{appt.patientName} → {appt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{appt.date} at {appt.time} • {appt.type}</p>
                  </div>
                  <Badge variant="outline" className={statusStyles[appt.status]}>{appt.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
