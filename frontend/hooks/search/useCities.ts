import { useState, useEffect } from "react";
import { getCities } from "../../services/toolService";

export function useCities() {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCities = await getCities();
        setCities(fetchedCities);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch cities";
        setError(errorMessage);
        console.error("Error fetching cities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return {
    cities,
    loading,
    error,
  };
}
