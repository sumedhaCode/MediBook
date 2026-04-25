import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Users, Stethoscope } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
  });

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex justify-between">
            <div>
              <p>Total Users</p>
              <h2 className="text-xl font-bold">{stats.users}</h2>
            </div>
            <Users />
          </Card>

          <Card className="p-4 flex justify-between">
            <div>
              <p>Total Doctors</p>
              <h2 className="text-xl font-bold">{stats.doctors}</h2>
            </div>
            <Stethoscope />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}