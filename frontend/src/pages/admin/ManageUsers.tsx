import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUser = async (user: any) => {
    await API.patch(`/admin/users/${user.id}/toggle`);
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Manage Users</h1>

        {users.map((u) => (
          <div
            key={u.id}
            className="border p-4 rounded-lg flex justify-between"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm">{u.email}</p>
            </div>

            <div className="flex gap-3 items-center">
              <Badge>{u.role}</Badge>

              <Badge
                className={
                  u.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200"
                }
              >
                {u.isActive ? "Active" : "Inactive"}
              </Badge>

              <Button size="sm" onClick={() => toggleUser(u)}>
                Toggle
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}