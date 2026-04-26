import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // ✅ Convert once at top — use this everywhere
  const numericDoctorId = Number(doctorId);

  // 🔹 FETCH DOCTOR
  useEffect(() => {
    if (!numericDoctorId) return;

    API.get("/doctors")
      .then((res) => {
        const found = res.data.find((d: any) => d.id === numericDoctorId);
        setDoctor(found || null);
      })
      .catch((err) => console.error(err));
  }, [numericDoctorId]);

  // 🔹 FETCH SLOTS
  useEffect(() => {
    if (!date || !numericDoctorId) return;

    const formatted = date.toISOString().split("T")[0];

    console.log("Fetching slots for doctorId:", numericDoctorId, "date:", formatted);

    setLoadingSlots(true);
    setSlots([]); // ✅ clear old slots before fetching new ones

    API.get(`/availability/${numericDoctorId}/${formatted}`, {
      headers: { "Cache-Control": "no-cache" }, // ✅ prevents 304 cached response
    })
      .then((res) => {
        console.log("Slots received:", res.data);
        setSlots(res.data || []);
      })
      .catch((err) => console.error("Slots fetch error:", err))
      .finally(() => setLoadingSlots(false));

  }, [date, numericDoctorId]);

  // 🔹 BOOK APPOINTMENT
  const handleBook = async () => {
    if (!date || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }

    try {
      const formatted = date.toISOString().split("T")[0];

      await API.post("/appointments", {
        doctorId: numericDoctorId,
        date: formatted,
        time: selectedSlot,
      });

      toast.success("Appointment booked!");
      navigate("/patient/appointments");

    } catch (error) {
      console.error(error);
      toast.error("Booking failed");
    }
  };

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">
          Loading doctor...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Doctor Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-primary">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {doctor.location}
                </p>
                <p className="mt-2 font-semibold">₹{doctor.consultation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setSelectedSlot(null); // ✅ reset selected slot on date change
                  setDate(d);
                }}
                disabled={(d) => d < new Date()}
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Select Time</CardTitle>
            </CardHeader>
            <CardContent>
              {!date ? (
                <p className="text-center text-sm text-muted-foreground">
                  Select a date first
                </p>
              ) : loadingSlots ? (
                <p className="text-center text-sm text-muted-foreground">
                  Loading slots...
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-2 text-center">
                      No slots available for this date
                    </p>
                  ) : (
                    slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={cn(
                          "p-2 rounded border text-sm transition-colors",
                          selectedSlot === slot.time
                            ? "border-primary bg-secondary font-medium"
                            : "hover:border-primary/50"
                        )}
                      >
                        {slot.time}
                      </button>
                    ))
                  )}
                </div>
              )}

              <Button
                className="w-full mt-6"
                onClick={handleBook}
                disabled={!date || !selectedSlot}
              >
                Confirm Booking
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}