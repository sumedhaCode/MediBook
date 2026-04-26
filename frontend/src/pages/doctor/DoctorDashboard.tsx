import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, TrendingUp, RefreshCw } from "lucide-react";

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setRefreshing(true);
      }

      const res = await API.get("/appointments/doctor", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 10000);

    const handleFocus = () => {
      fetchAppointments();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchAppointments]);

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter((a) => a.date === today);
  const pending = appointments.filter((a) => a.status === "pending");
  const upcoming = appointments.filter(
    (a) => a.status === "upcoming" || a.status === "pending"
  );

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Total Patients",
      value: new Set(
        appointments.map((a) => a.patientId || a.userId || a.patient?.id)
      ).size,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Pending Requests",
      value: pending.length,
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "This Month",
      value: appointments.length,
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Doctor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAppointments(true)}
            disabled={refreshing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
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
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {appt.patient?.name || appt.user?.name || "Patient"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appt.date} at {appt.time}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        statusStyles[appt.status] ||
                        "bg-secondary text-foreground border-border"
                      }
                    >
                      {appt.status}
                    </Badge>
                  </div>
                ))}

                {upcoming.length === 0 && (
                  <p className="text-center py-6 text-muted-foreground">
                    No upcoming appointments
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}