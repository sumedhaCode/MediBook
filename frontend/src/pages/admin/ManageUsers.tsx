import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/users");

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const patients = users.filter((user) => user.role === "patient");
  const doctors = users.filter((user) => user.role === "doctor");

  const UserCard = ({ user }: any) => (
    <div className="border p-4 rounded-lg flex justify-between items-center">
      <div>
        <p className="font-semibold">{user.name}</p>

        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <Badge variant={user.role === "doctor" ? "default" : "secondary"}>
        {user.role === "doctor" ? "Doctor" : "Patient"}
      </Badge>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Users</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Total users: <strong>{patients.length + doctors.length}</strong>
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : (
          <Tabs defaultValue="patients">
            <TabsList>
              <TabsTrigger value="patients">
                Patients ({patients.length})
              </TabsTrigger>

              <TabsTrigger value="doctors">
                Doctors ({doctors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patients" className="space-y-3 mt-4">
              {patients.length === 0 ? (
                <p className="text-muted-foreground">No patients found.</p>
              ) : (
                patients.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              )}
            </TabsContent>

            <TabsContent value="doctors" className="space-y-3 mt-4">
              {doctors.length === 0 ? (
                <p className="text-muted-foreground">No doctors found.</p>
              ) : (
                doctors.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}