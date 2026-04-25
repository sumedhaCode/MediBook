import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Manage Users</h1>
          {/* ✅ Shows correct total count */}
          <p className="text-sm text-muted-foreground mt-1">
            Total users: <strong>{users.length}</strong>
          </p>
        </div>

        {users.length === 0 && (
          <p className="text-muted-foreground">No users found.</p>
        )}

        {users.map((u) => (
          <div key={u.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>
            {/* ✅ Just show role — no toggle button */}
            <Badge>{u.role}</Badge>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}