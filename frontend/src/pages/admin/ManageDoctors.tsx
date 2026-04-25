import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  const fetchDoctors = async () => {
    const res = await API.get("/admin/doctors");
    setDoctors(res.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (doc: any) => {
    if (!confirm(`Delete Dr. ${doc.name}? This cannot be undone.`)) return;

    try {
      await API.delete(`/admin/doctors/${doc.id}`);
      toast.success("Doctor deleted");
      fetchDoctors();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (doc: any) => {
    try {
      await API.patch(`/admin/doctors/${doc.id}/toggle`);
      fetchDoctors();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Manage Doctors</h1>

        {doctors.length === 0 && <p>No doctors found</p>}

        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{doc.name}</p>
              <p className="text-sm text-muted-foreground">
                {doc.specialty}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                className={
                  doc.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }
              >
                {doc.isActive ? "Active" : "Inactive"}
              </Badge>

              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleStatus(doc)}
              >
                Toggle
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(doc)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}