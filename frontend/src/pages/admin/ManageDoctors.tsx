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

  const handleRemove = async (doc: any) => {
    const confirm = window.confirm(
      `Are you sure you want to delete Dr. ${doc.name}?`
    );

    if (!confirm) return;

    try {
      await API.delete(`/admin/doctors/${doc.id}`);
      toast.success(`Dr. ${doc.name} removed`);
      fetchDoctors();
    } catch (err) {
      toast.error("Failed to remove doctor");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Manage Doctors</h1>

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
                  doc.available
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {doc.available ? "Active" : "Inactive"}
              </Badge>

              <Button
                variant="destructive"
                onClick={() => handleRemove(doc)}
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