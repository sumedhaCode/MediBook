import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockTimeSlots } from "@/data/mockData";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ManageAvailability() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState(mockTimeSlots);

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, available: !s.available } : s))
    );
  };

  const handleSave = () => {
    toast.success("Availability updated successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Availability</h1>
          <p className="text-muted-foreground mt-1">Set your available time slots for appointments</p>
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
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      slot.available ? "bg-secondary/50" : "bg-muted/30"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{slot.time}</span>
                    <Switch
                      checked={slot.available}
                      onCheckedChange={() => toggleSlot(slot.id)}
                    />
                  </div>
                ))}
              </div>
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
