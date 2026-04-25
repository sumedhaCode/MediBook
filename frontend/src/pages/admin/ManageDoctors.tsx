import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  const fetchDoctors = async () => {
    const res = await API.get("/admin/doctors");
    setDoctors(res.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleRemove = async (id: number) => {
    await API.delete(`/admin/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold">Manage Doctors</h1>

        {doctors.map((doc) => (
          <div key={doc.id} className="border p-3 my-2 flex justify-between">
            <div>
              <p>{doc.name}</p>
              <p>{doc.specialty}</p>
            </div>

            <Button onClick={() => handleRemove(doc.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}