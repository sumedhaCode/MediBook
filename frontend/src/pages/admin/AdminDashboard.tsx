import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* ✅ Only doctors count — removed users card */}
          <Card className="p-4">
            <p className="text-muted-foreground text-sm">Total Doctors</p>
            <h2 className="text-3xl font-bold mt-1">{stats.doctors}</h2>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}