import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Star, Clock } from "lucide-react";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/doctors");

      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDeleteDoctor = async (doctorId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this doctor? They will be hidden from patients."
    );

    if (!confirmed) return;

    try {
      setDeletingId(doctorId);

      await API.delete(`/admin/doctors/${doctorId}`);

      toast.success("Doctor removed successfully");

      await fetchDoctors();
    } catch (error: any) {
      console.error("Delete doctor error:", error);

      toast.error(
        error?.response?.data?.error || "Failed to delete doctor"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestoreDoctor = async (doctorId: number) => {
    try {
      setDeletingId(doctorId);

      await API.patch(`/admin/doctors/${doctorId}/restore`);

      toast.success("Doctor restored successfully");

      await fetchDoctors();
    } catch (error: any) {
      console.error("Restore doctor error:", error);

      toast.error(
        error?.response?.data?.error || "Failed to restore doctor"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const activeDoctors = doctors.filter((doctor) => doctor.isActive !== false);
  const inactiveDoctors = doctors.filter((doctor) => doctor.isActive === false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Manage Doctors</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Active doctors: <strong>{activeDoctors.length}</strong> • Removed
            doctors: <strong>{inactiveDoctors.length}</strong>
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="text-muted-foreground">No doctors found.</p>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => {
              const isInactive = doctor.isActive === false;

              return (
                <div
                  key={doctor.id}
                  className="border p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{doctor.name}</h3>

                      {isInactive ? (
                        <Badge variant="outline">Removed</Badge>
                      ) : (
                        <Badge>Active</Badge>
                      )}
                    </div>

                    <p className="text-sm text-primary font-medium mt-1">
                      {doctor.specialty}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {doctor.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {doctor.experience} yrs exp
                      </span>

                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {doctor.rating ?? 4.5}
                      </span>

                      <span>₹{doctor.consultation}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isInactive ? (
                      <Button
                        variant="outline"
                        disabled={deletingId === doctor.id}
                        onClick={() => handleRestoreDoctor(doctor.id)}
                      >
                        {deletingId === doctor.id ? "Restoring..." : "Restore"}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        disabled={deletingId === doctor.id}
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        {deletingId === doctor.id ? "Removing..." : "Delete"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}