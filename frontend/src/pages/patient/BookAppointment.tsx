import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSlotFreeze } from "@/hooks/useSlotFreeze";
import { useFreezeCountdown } from "@/hooks/useFreezeCountdown";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [freezeExpiresAt, setFreezeExpiresAt] = useState<Date | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [freezingSlot, setFreezingSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);

  const numericDoctorId = Number(doctorId);

  const { freezeSlot, releaseFreeze } = useSlotFreeze();

  // FIX 1: Rename `formatted` from the hook to `countdownFormatted`
  // so it doesn't collide with the date string you construct inside handlers.
  const { secondsLeft, formatted: countdownFormatted, expired } =
    useFreezeCountdown(freezeExpiresAt);

  const getFormattedDate = (value: Date) =>
    value.toISOString().split("T")[0];

  const fetchSlots = useCallback(async () => {
    if (!date || !numericDoctorId) return;
    const dateStr = getFormattedDate(date);
    try {
      setLoadingSlots(true);
      const res = await API.get(`/availability/${numericDoctorId}/${dateStr}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      setSlots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Slots fetch error:", err);
      toast.error("Failed to load latest slots");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [date, numericDoctorId]);

  useEffect(() => {
    if (!numericDoctorId) { setDoctorLoading(false); return; }
    setDoctorLoading(true);
    API.get("/doctors")
      .then((res) => {
        const doctors = Array.isArray(res.data) ? res.data : [];
        const found = doctors.find((d: any) => Number(d.id) === numericDoctorId);
        setDoctor(found || null);
        if (!found) toast.error("Doctor not found");
      })
      .catch((err) => {
        console.error("Doctor fetch error:", err);
        toast.error("Failed to load doctor");
        setDoctor(null);
      })
      .finally(() => setDoctorLoading(false));
  }, [numericDoctorId]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  useEffect(() => {
    if (!date || !numericDoctorId) return;
    const handleFocus = () => fetchSlots();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [date, numericDoctorId, fetchSlots]);

  // Clear selection when freeze expires
useEffect(() => {
  if (!freezeExpiresAt || !selectedSlot || !expired) return;

  const msLeft = freezeExpiresAt.getTime() - Date.now();

  if (msLeft > 10_000) return;

  toast.error("Your 5-minute hold expired. Please select the slot again.");
  setSelectedSlot(null);
  setFreezeExpiresAt(null);
  fetchSlots();
}, [freezeExpiresAt, expired, selectedSlot, fetchSlots]);

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    await releaseFreeze();
    setSelectedSlot(null);
    setFreezeExpiresAt(null);
    setDate(selectedDate);
  };

  const handleSlotSelect = async (slot: any) => {
    if (!date || !numericDoctorId) {
      toast.error("Please select a date first");
      return;
    }
    if (slot.available === false) {
      toast.error("This slot is not available");
      return;
    }

    // FIX 2: Use a locally named variable — not `formatted` — to avoid
    // any accidental shadowing of the hook's `countdownFormatted`.
    const dateStr = getFormattedDate(date);

    try {
      setFreezingSlot(slot.time);

      const result = await freezeSlot({
        doctorId: numericDoctorId,
        date: dateStr,
        time: slot.time,
      });

      // FIX 3: This is the critical fix.
      // result.expiresAt comes from the API as a string like "2025-04-28T10:35:00.000Z".
      // If you pass a raw string to setFreezeExpiresAt (which expects Date | null),
      // useFreezeCountdown will get a non-Date and secondsLeft stays 0 → expired = true
      // → button stays disabled. Always convert to a real Date object here.
      if (result.success && result.expiresAt) {
        const expiresDate =
          result.expiresAt instanceof Date
            ? result.expiresAt
            : new Date(result.expiresAt); // <-- THE ACTUAL FIX

        // Guard: if parsing failed (Invalid Date), don't enable the button
        if (isNaN(expiresDate.getTime())) {
          toast.error("Server returned an invalid expiry time. Please try again.");
          setSelectedSlot(null);
          setFreezeExpiresAt(null);
          await fetchSlots();
          return;
        }

        setSelectedSlot(slot.time);
        setFreezeExpiresAt(expiresDate); // Now a real Date — button enables correctly
        toast.success("Slot held for 5 minutes. Confirm booking soon.");
        return;
      }

      // Freeze failed
if (result.success === false) {
  setSelectedSlot(null);
  setFreezeExpiresAt(null);

  if (result.code === "SLOT_FROZEN" && result.secondsLeft) {
    toast.error(
      `This slot is temporarily held by another patient. Try again in ${result.secondsLeft}s.`
    );
  } else {
    toast.error(result.error || "Could not hold this slot");
  }

  await fetchSlots();
}
    } catch (error) {
      console.error("Slot freeze error:", error);
      toast.error("Could not hold this slot");
    } finally {
      setFreezingSlot(null);
    }
  };

  const handleBook = async () => {
    if (!date || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    if (!freezeExpiresAt) {
      toast.error("Please select the slot again before booking.");
      setSelectedSlot(null);
      await fetchSlots();
      return;
    }
    // FIX 4: Check expiry directly from Date arithmetic, not from the
    // `expired` boolean from the hook, which can lag by up to 1 second.
    if (new Date() >= freezeExpiresAt) {
      toast.error("Your slot hold expired. Please select the slot again.");
      setSelectedSlot(null);
      setFreezeExpiresAt(null);
      await fetchSlots();
      return;
    }

    try {
      setBooking(true);
      const dateStr = getFormattedDate(date);

      await API.post("/appointments", {
        doctorId: numericDoctorId,
        date: dateStr,
        time: selectedSlot,
      });

      toast.success("Appointment booked!");
      setSelectedSlot(null);
      setFreezeExpiresAt(null);
      await fetchSlots();
      navigate("/patient/appointments");
    } catch (error: any) {
      console.error("Booking error:", error);
      const status = error?.response?.status;
      const code = error?.response?.data?.code;
      const backendError = error?.response?.data?.error;

      if (status === 409 || code === "SLOT_ALREADY_BOOKED" || code === "SLOT_NOT_AVAILABLE") {
        toast.error("This slot was just booked by someone else. Please choose another time.");
        setSelectedSlot(null);
        setFreezeExpiresAt(null);
        await fetchSlots();
        return;
      }
      if (status === 423 || code === "FREEZE_EXPIRED" || code === "FREEZE_REQUIRED") {
        toast.error(backendError || "Your slot hold expired. Please select the slot again.");
        setSelectedSlot(null);
        setFreezeExpiresAt(null);
        await fetchSlots();
        return;
      }
      toast.error(backendError || "Booking failed");
      await fetchSlots();
    } finally {
      setBooking(false);
    }
  };

  if (doctorLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">Loading doctor...</div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="space-y-4 text-center py-12">
          <p className="text-muted-foreground">Doctor not found.</p>
          <Button onClick={() => navigate("/patient/dashboard")}>Back to Dashboard</Button>
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-primary">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground mt-2">{doctor.location}</p>
                <p className="mt-2 font-semibold">₹{doctor.consultation}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Select Date</CardTitle></CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(d) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const sel = new Date(d);
                  sel.setHours(0, 0, 0, 0);
                  return sel < today;
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Select Time</CardTitle></CardHeader>
            <CardContent>
              {!date ? (
                <p className="text-center text-sm text-muted-foreground">Select a date first</p>
              ) : loadingSlots ? (
                <p className="text-center text-sm text-muted-foreground">Loading slots...</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-2 text-center">
                      No slots available for this date
                    </p>
                  ) : (
                    slots.map((slot) => {
                      const isUnavailable = slot.available === false;
                      const isSelected = selectedSlot === slot.time;
                      const isFreezing = freezingSlot === slot.time;

                      return (
                        <button
                          key={slot.id || slot.time}
                          type="button"
                          disabled={isUnavailable || booking || isFreezing}
                          onClick={() => handleSlotSelect(slot)}
                          className={cn(
                            "p-2 rounded border text-sm transition-colors",
                            isSelected ? "border-primary bg-secondary font-medium" : "hover:border-primary/50",
                            isUnavailable && "opacity-50 cursor-not-allowed line-through",
                            (booking || isFreezing) && "opacity-70 cursor-not-allowed"
                          )}
                        >
                          {isFreezing ? "Holding..." : slot.time}
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {/* FIX 5: Use countdownFormatted (renamed from hook) instead of formatted */}
              {selectedSlot && freezeExpiresAt && !expired && (
                <div className={cn(
                  "mt-4 rounded border p-3 text-sm text-center",
                  secondsLeft <= 60 ? "border-red-300 text-red-600" : "border-green-300 text-green-700"
                )}>
                  Slot reserved for {countdownFormatted}. Complete booking before it expires.
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={fetchSlots}
                disabled={!date || loadingSlots || booking}
              >
                {loadingSlots ? "Refreshing..." : "Refresh Slots"}
              </Button>

              {/* FIX 6: Remove !freezeExpiresAt from disabled — once the slot is
                  selected and freeze is set, only block if actively booking or
                  if the freeze actually expired. This is what was blocking the button. */}
              <Button
  className="w-full mt-3"
  onClick={handleBook}
  disabled={!date || !selectedSlot || !freezeExpiresAt || booking}
>
  {booking ? "Booking..." : "Confirm Booking"}
</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}