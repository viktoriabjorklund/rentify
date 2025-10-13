import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Tool,
  createTool as apiCreateTool,
  getUserTools,
} from "../../services/toolService";
import { useAuth } from "../auth/useAuth";
import {
  filterTools,
  filterToolsByCategory,
  getRelevanceScore,
} from "../utils/searchUtils";

export function useYourTools() {
  const [query, setQuery] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // Fetch user's tools
  const fetchUserTools = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    try {
      setLoading(true);
      setError(null);
      const userTools = await getUserTools();
      setTools(userTools);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tools");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Fetch tools on mount
  useEffect(() => {
    fetchUserTools();
  }, [fetchUserTools]);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = filterTools(tools, query);

    // Sort by relevance if there's a search query
    if (query) {
      filtered.sort((a, b) => {
        const aScore = getRelevanceScore(a, query);
        const bScore = getRelevanceScore(b, query);
        return bScore - aScore;
      });
    }

    return filtered;
  }, [tools, query]);

  const retry = () => {
    fetchUserTools();
  };

  // UPDATED createTool signature: accepts photo?: File
  const createTool = useCallback(
    async (toolData: {
      name: string;
      description?: string;
      price: number;
      location: string;
      photo?: File;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const newTool = await apiCreateTool(toolData);

        // append to local state
        setTools((prev) => [...prev, newTool]);

        return newTool;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create tool");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    query,
    setQuery,
    tools: filteredTools,
    loading,
    error,
    retry,
    user,
    createTool, // return the updated createTool
  };
}
