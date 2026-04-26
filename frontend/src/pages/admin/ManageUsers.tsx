import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => {
        // ✅ Only doctors (extra safety)
        const filtered = res.data.filter(
          (user: any) => user.role === "doctor"
        );
        setUsers(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total doctors: <strong>{users.length}</strong>
          </p>
        </div>

        {users.length === 0 && (
          <p className="text-muted-foreground">No doctors found.</p>
        )}

        {users.map((u) => (
          <div
            key={u.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>
            <Badge>Doctor</Badge>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}