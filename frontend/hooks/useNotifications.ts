import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Global event system for notifying about notification count changes
const notificationEvents = new EventTarget();

export function useNotifications() {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchNotificationCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const recRes = await fetch(`${API_BASE_URL}/api/requests/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sentRes = await fetch(`${API_BASE_URL}/api/requests/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let total = 0;
      if (recRes.ok) {
        const received = await recRes.json();
        total += received.filter(
          (r: any) => r && r.pending === true && !r.viewed
        ).length;
      }
      if (sentRes.ok) {
        const sent = await sentRes.json();
        total += sent.filter(
          (r: any) =>
            r &&
            r.pending === false &&
            (r.accepted === true || r.accepted === false) &&
            !r.viewed
        ).length;
      }
      setCount(total);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }

    // Kör direkt vid inloggning
    fetchNotificationCount();

    // Lyssna på globala refresh-events
    const handleRefresh = () => fetchNotificationCount();
    notificationEvents.addEventListener("refresh", handleRefresh);

    // Uppdatera automatiskt var 30:e sekund
    const interval = setInterval(fetchNotificationCount, 30000);

    return () => {
      clearInterval(interval);
      notificationEvents.removeEventListener("refresh", handleRefresh);
    };
  }, [isAuthenticated, fetchNotificationCount]);

  return { count, refresh: fetchNotificationCount };
}

// Funktion för att trigga refresh var som helst i appen
export function triggerNotificationRefresh() {
  notificationEvents.dispatchEvent(new Event("refresh"));
}
