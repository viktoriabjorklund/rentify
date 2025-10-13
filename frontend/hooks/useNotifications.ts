//denna borde fungera sen för att visa notifikationer i bla. navbar

import { useState, useEffect } from 'react';
import { useAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch received requests (people wanting to rent YOUR tools)
        const response = await fetch(`${API_BASE_URL}/api/requests/received`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const requests = await response.json();
          // Count only unviewed, pending requests
          const unviewedCount = requests.filter((req: any) => !req.viewed && req.pending).length;
          setCount(unviewedCount);
        }
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    fetchNotificationCount();

    // poll for updates every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return { count };
}

