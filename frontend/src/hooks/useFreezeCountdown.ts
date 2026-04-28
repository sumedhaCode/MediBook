import { useEffect, useState } from "react";

export function useFreezeCountdown(expiresAt: Date | null) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0);
      return;
    }

    const updateCountdown = () => {
      const diff = Math.max(
        0,
        Math.ceil((expiresAt.getTime() - Date.now()) / 1000)
      );

      setSecondsLeft(diff);
    };

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return {
    secondsLeft,
    formatted,
    expired: expiresAt !== null && secondsLeft === 0,
  };
}