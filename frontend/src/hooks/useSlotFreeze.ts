import { useCallback, useEffect, useRef } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://medibook-auth-service.onrender.com";

type FreezeSlotArgs = {
  doctorId: number;
  date: string;
  time: string;
};

type FreezeSuccess = {
  success: true;
  expiresAt: Date;
};

type FreezeFailure = {
  success: false;
  code?: string;
  error: string;
  secondsLeft?: number;
};

type FreezeResult = FreezeSuccess | FreezeFailure;

export function useSlotFreeze() {
  const currentFreezeRef = useRef<FreezeSlotArgs | null>(null);

  const releaseFreeze = useCallback(async () => {
    const currentFreeze = currentFreezeRef.current;

    if (!currentFreeze) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_BASE}/api/freeze`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentFreeze),
      });
    } catch (error) {
      console.error("Release freeze failed:", error);
    } finally {
      currentFreezeRef.current = null;
    }
  }, []);

  const freezeSlot = useCallback(
    async ({ doctorId, date, time }: FreezeSlotArgs): Promise<FreezeResult> => {
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          error: "Please login before booking.",
          code: "NO_TOKEN",
        };
      }

      const previousFreeze = currentFreezeRef.current;

      const isDifferentSlot =
        previousFreeze &&
        (previousFreeze.doctorId !== doctorId ||
          previousFreeze.date !== date ||
          previousFreeze.time !== time);

      if (isDifferentSlot) {
        await releaseFreeze();
      }

      try {
        const response = await fetch(`${API_BASE}/api/freeze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId,
            date,
            time,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || "Could not hold this slot.",
            code: data.code,
            secondsLeft: data.secondsLeft,
          };
        }

        currentFreezeRef.current = {
          doctorId,
          date,
          time,
        };

        return {
          success: true,
          expiresAt: new Date(data.freeze.expiresAt),
        };
      } catch (error) {
        console.error("Freeze slot failed:", error);

        return {
          success: false,
          error: "Network error while holding slot.",
          code: "NETWORK_ERROR",
        };
      }
    },
    [releaseFreeze]
  );

  useEffect(() => {
    return () => {
      releaseFreeze();
    };
  }, [releaseFreeze]);

  return {
    freezeSlot,
    releaseFreeze,
  };
}