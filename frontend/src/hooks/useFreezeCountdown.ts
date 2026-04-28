import { useEffect, useState } from "react";

function getSecondsLeft(expiresAt: Date | null) {
  if (!expiresAt) return 0;

  return Math.max(
    0,
    Math.ceil((expiresAt.getTime() - Date.now()) / 1000)
  );
}

export function useFreezeCountdown(expiresAt: Date | null) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsLeft(expiresAt)
  );

  useEffect(() => {
    setSecondsLeft(getSecondsLeft(expiresAt));

    if (!expiresAt) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft(getSecondsLeft(expiresAt));
    }, 1000);

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
    expired: expiresAt !== null && secondsLeft <= 0,
  };
}