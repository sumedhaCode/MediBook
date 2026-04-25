import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ManageAvailability() {
  const { user } = useAuth();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultSlots = [
    "9:00 AM","9:30 AM","10:00 AM","10:30 AM",
    "11:00 AM","11:30 AM","1:00 PM","1:30 PM",
    "2:00 PM","2:30 PM","3:00 PM","3:30 PM"
  ];

  // 🔥 FETCH doctorId properly
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    API.get("/doctors")
      .then((res) => {
        const found = res.data.find((d:any) => d.userId === user?.id);
        if (found) setDoctorId(found.id);
      });
  }, [user]);

  // 🔥 FETCH availability
  useEffect(() => {
    if (!date || !doctorId) return;

    const formatted = date.toISOString().split("T")[0];

    setLoading(true);

    API.get(`/availability/${doctorId}/${formatted}`)
      .then((res) => {
        if (res.data.length === 0) {
          setSlots(defaultSlots.map(t => ({ time: t, available: false })));
        } else {
          setSlots(res.data);
        }
      })
      .finally(() => setLoading(false));

  }, [date, doctorId]);

  const toggleSlot = (index: number) => {
    setSlots(prev =>
      prev.map((s, i) =>
        i === index ? { ...s, available: !s.available } : s
      )
    );
  };

  const handleSave = async () => {
    if (!date) return;

    const formatted = date.toISOString().split("T")[0];

    await API.post("/availability", {
      date: formatted,
      slots,
    });

    toast.success("Saved!");
  };

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-2 gap-6">

        <Card>
          <CardHeader><CardTitle>Select Date</CardTitle></CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Time Slots</CardTitle></CardHeader>
          <CardContent>

            {loading ? "Loading..." : slots.map((slot, i) => (
              <div key={i} className="flex justify-between p-2 border rounded">
                {slot.time}
                <Switch
                  checked={slot.available}
                  onCheckedChange={() => toggleSlot(i)}
                />
              </div>
            ))}

            <Button className="mt-4 w-full" onClick={handleSave}>
              Save Changes
            </Button>

          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}