import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  available: boolean;
}

export default function SearchDoctors() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [location, setLocation] = useState("All"); // optional (not in DB yet)

  // ✅ FETCH REAL DATA
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };

    fetchDoctors();
  }, []);

  // ✅ FILTER (REAL DATA)
  const filtered = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = specialization === "All" || doc.specialty === specialization;
    return matchesSearch && matchesSpec;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Find a Doctor - Search from our network of verified specialists
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* SPECIALIZATION FILTER */}
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {[...new Set(doctors.map((d) => d.specialty))].map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* RESULTS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doctor) => (
            <div key={doctor.id} className="card-doctor">
              <div className="flex items-start gap-4">

                {/* AVATAR */}
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {doctor.name.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {doctor.name}
                  </h3>

                  <p className="text-sm text-primary font-medium">
                    {doctor.specialty}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {/* optional fake location */}
                      India
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doctor.experience}y exp
                    </span>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    4.5
                  </span>

                  <span className="text-sm font-semibold text-foreground">
                    ₹500
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {doctor.available ? (
                    <Badge variant="secondary" className="text-xs">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Unavailable
                    </Badge>
                  )}

                  <Link to={`/patient/book/${doctor.id}`}>
                    <Button size="sm" disabled={!doctor.available}>
                      Book
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No doctors found.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}