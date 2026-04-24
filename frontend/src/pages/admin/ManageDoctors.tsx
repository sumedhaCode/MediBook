import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockDoctors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Trash2, MapPin, Star } from "lucide-react";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [search, setSearch] = useState("");

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    toast.success("Doctor removed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Doctors</h1>
            <p className="text-muted-foreground mt-1">{doctors.length} registered doctors</p>
          </div>
          <Button onClick={() => toast.info("Add doctor form coming soon")}>Add Doctor</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className="card-doctor">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {doc.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-primary">{doc.specialization}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{doc.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{doc.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={doc.available ? "secondary" : "outline"}>
                  {doc.available ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t">
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleRemove(doc.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
