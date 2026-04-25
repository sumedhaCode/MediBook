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

  // 🔹 default slots (only if no data in DB)
  const defaultSlots = [
    { time: "9:00 AM", available: false },
    { time: "9:30 AM", available: false },
    { time: "10:00 AM", available: false },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: false },
    { time: "11:30 AM", available: false },
    { time: "1:00 PM", available: false },
    { time: "1:30 PM", available: false },
    { time: "2:00 PM", available: false },
    { time: "2:30 PM", available: false },
    { time: "3:00 PM", available: false },
    { time: "3:30 PM", available: false },
  ];

  // 🔥 FETCH availability when date changes
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);

        const formatted = date.toISOString().split("T")[0];

        // ⚠️ IMPORTANT: doctorId = user.id mapping happens in backend
        const res = await API.get(`/availability/${user?.id}/${formatted}`);

        if (res.data.length === 0) {
          setSlots(defaultSlots);
        } else {
          setSlots(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch availability", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  // 🔹 toggle slot
  const toggleSlot = (index: number) => {
    setSlots((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, available: !s.available } : s
      )
    );
  };

  // 🔥 SAVE to backend
  const handleSave = async () => {
    if (!date) return;

    try {
      const formatted = date.toISOString().split("T")[0];

      await API.post("/availability", {
        date: formatted,
        slots,
      });

      toast.success("Availability saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save availability");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manage Availability
          </h1>
          <p className="text-muted-foreground mt-1">
            Set your available time slots for appointments
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
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
              <CardTitle className="text-lg">
                Time Slots {date && `— ${date.toLocaleDateString()}`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        slot.available
                          ? "bg-secondary/50"
                          : "bg-muted/30"
                      )}
                    >
                      <span className="text-sm font-medium">
                        {slot.time}
                      </span>

                      <Switch
                        checked={slot.available}
                        onCheckedChange={() => toggleSlot(index)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full mt-4" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 