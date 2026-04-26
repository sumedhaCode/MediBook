import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Slot {
  id?: number;
  time: string;
  available: boolean;
}

const DEFAULT_SLOTS: Slot[] = [
  { time: "9:00 AM",  available: false },
  { time: "9:30 AM",  available: false },
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: false },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: false },
  { time: "1:00 PM",  available: false },
  { time: "1:30 PM",  available: false },
  { time: "2:00 PM",  available: false },
  { time: "2:30 PM",  available: false },
  { time: "3:00 PM",  available: false },
  { time: "3:30 PM",  available: false },
];

export default function ManageAvailability() {
  const { user } = useAuth();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<Slot[]>(DEFAULT_SLOTS);
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  // Step 1 — get this doctor's doctorId from the doctors list
  useEffect(() => {
    if (!user?.id) return;

    API.get("/doctors")
      .then((res) => {
        const found = res.data.find((d: any) => d.userId === user.id);
        if (found) setDoctorId(found.id);
      })
      .catch((err) => console.error("Failed to get doctorId", err));

  }, [user]);

  // Step 2 — fetch ALL slots for this date (manage route = no available filter)
  useEffect(() => {
    if (!date || !doctorId) return;

    const formatted = date.toISOString().split("T")[0];
    setLoading(true);

    API.get(`/availability/manage/${doctorId}/${formatted}`)
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          // No saved slots yet — show default 12 slots all OFF
          setSlots(DEFAULT_SLOTS);
        } else {
          // Merge: show all 12 slots, use saved toggle state from DB
          const saved: Slot[] = res.data;
          const merged = DEFAULT_SLOTS.map((defaultSlot) => {
            const match = saved.find((s) => s.time === defaultSlot.time);
            return match ? { ...defaultSlot, available: match.available } : defaultSlot;
          });
          setSlots(merged);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch slots", err);
        setSlots(DEFAULT_SLOTS);
      })
      .finally(() => setLoading(false));

  }, [date, doctorId]);

  const toggleSlot = (index: number) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, available: !s.available } : s))
    );
  };

  const handleSave = async () => {
    if (!date) return;

    const formatted = date.toISOString().split("T")[0];

    try {
      await API.post("/availability", {
        date: formatted,
        slots,
      });
      toast.success("Saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Availability</h1>
          <p className="text-muted-foreground mt-1">
            Set your available time slots for appointments
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <Card>
            <CardHeader><CardTitle>Select Date</CardTitle></CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="pointer-events-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Time Slots {date && `— ${date.toLocaleDateString()}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Loading slots...
                </p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        slot.available ? "bg-secondary/50" : "bg-muted/30"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">
                        {slot.time}
                      </span>
                      <Switch
                        checked={slot.available}
                        onCheckedChange={() => toggleSlot(i)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full mt-4" onClick={handleSave} disabled={loading}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}