import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockDoctors, mockTimeSlots } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Star, Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = mockDoctors.find((d) => d.id === doctorId);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">Doctor not found.</div>
      </DashboardLayout>
    );
  }

  const handleBook = () => {
    if (!date || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    toast.success(`Appointment booked with ${doctor.name}!`);
    navigate("/patient/appointments");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-4">
                  {doctor.avatar}
                </div>
                <h2 className="text-xl font-bold text-foreground">{doctor.name}</h2>
                <p className="text-primary font-medium">{doctor.specialization}</p>
                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{doctor.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{doctor.experience}y</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="font-semibold text-foreground">{doctor.rating}</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-2xl font-bold text-foreground">${doctor.fee}</p>
                  <p className="text-xs text-muted-foreground">per consultation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                className="pointer-events-auto"
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Time</CardTitle>
            </CardHeader>
            <CardContent>
              {date ? (
                <div className="grid grid-cols-2 gap-2">
                  {mockTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "p-2.5 rounded-lg border text-sm transition-all",
                        !slot.available && "opacity-40 cursor-not-allowed bg-muted",
                        slot.available && selectedSlot !== slot.id && "hover:border-primary/50 cursor-pointer",
                        selectedSlot === slot.id && "border-primary bg-secondary text-secondary-foreground font-medium"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Please select a date first
                </p>
              )}
              <Button className="w-full mt-6" onClick={handleBook} disabled={!date || !selectedSlot}>
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
