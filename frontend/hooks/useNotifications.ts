//denna borde fungera sen för att visa notifikationer i bla. navbar

import { useState, useEffect } from "react";
import { useAuth } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function useNotifications() {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }

    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch received requests (people wanting to rent YOUR tools)
        const recRes = await fetch(`${API_BASE_URL}/api/requests/received`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch sent requests (you asked to rent someone else's tool)
        const sentRes = await fetch(`${API_BASE_URL}/api/requests/sent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let total = 0;
        if (recRes.ok) {
          const received = await recRes.json();
          // Unviewed new requests for owner: pending true and not viewed
          total += received.filter(
            (r: any) => r && r.pending === true && !r.viewed
          ).length;
        }
        if (sentRes.ok) {
          const sent = await sentRes.json();
          // Unviewed outcomes for renter: explicitly accepted or rejected (pending === false) and not viewed
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
    };

    fetchNotificationCount();

    // poll for updates every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return { count };
}
