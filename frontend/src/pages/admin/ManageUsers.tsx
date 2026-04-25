import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold">Manage Users</h1>

        {users.map((u) => (
          <div key={u.id} className="border p-3 my-2">
            <p>{u.name}</p>
            <p>{u.email}</p>
            <p>{u.role}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}