import { useState, useRef, useCallback } from 'react';
import { searchLocations, LocationResult } from '../../services/locationService';

/**
 * Hook for location search with autocomplete functionality
 * Provides debounced search and suggestion management
 */
export function useLocationSearch(debounceMs: number = 300) {
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Search for locations with debouncing
   */
  const search = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // If query is too short, clear suggestions
      if (!query || query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Set new timeout for API call
      searchTimeout.current = setTimeout(async () => {
        try {
          setLoading(true);
          setError(null);
          const results = await searchLocations(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to search locations');
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  /**
   * Select a location from suggestions
   */
  const selectLocation = useCallback((location: LocationResult) => {
    setShowSuggestions(false);
    setSuggestions([location]);
    return location;
  }, []);

  /**
   * Clear all suggestions
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  /**
   * Show existing suggestions (e.g., on input focus)
   */
  const showExistingSuggestions = useCallback(() => {
    if (suggestions.length > 0) {
      //setSuggestions([]);
      setShowSuggestions(true);
    }
  }, [suggestions]);

  const hideExistingSuggestions = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(false);
    }
  }, [suggestions]);

  return {
    suggestions,
    showSuggestions,
    loading,
    error,
    search,
    selectLocation,
    clearSuggestions,
    showExistingSuggestions,
    hideExistingSuggestions,
  };
}

