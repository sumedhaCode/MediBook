import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/admin/doctors");
      setDoctors(res.data);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (doc: any) => {
    if (!confirm(`Remove Dr. ${doc.name}?`)) return;

    try {
      await API.delete(`/admin/doctors/${doc.id}`);
      toast.success(`${doc.name} removed`);
      fetchDoctors(); // ✅ refresh list after delete
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Manage Doctors</h1>
          {/* ✅ Shows correct total count */}
          <p className="text-sm text-muted-foreground mt-1">
            Total doctors: <strong>{doctors.length}</strong>
          </p>
        </div>

        {doctors.length === 0 && (
          <p className="text-muted-foreground">No doctors found.</p>
        )}

        {doctors.map((doc) => (
          <div key={doc.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{doc.name}</p>
              <p className="text-sm text-muted-foreground">{doc.specialty}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {doc.location} · ₹{doc.consultation}
              </p>
            </div>

            {/* ✅ Only delete button — no toggle */}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(doc)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}