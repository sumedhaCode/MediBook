import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      }

      const res = await API.get("/admin/stats", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      setStats(res.data);
    } catch (error) {
      console.error("Error fetching admin stats", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 10000);

    const handleFocus = () => {
      fetchStats();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStats]);

  if (loading && !stats) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-muted-foreground text-sm">Total Doctors</p>
            <h2 className="text-3xl font-bold mt-1">{stats?.doctors ?? 0}</h2>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}