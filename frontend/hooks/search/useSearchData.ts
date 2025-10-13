import { useState, useEffect, useCallback } from 'react';
import { getAllTools, Tool, DEFAULT_TOOL_IMAGE } from '../../services/toolService';

export function useSearchData() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tools from API on component mount
  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTools = await getAllTools();
      
      // Add default image to tools that don't have one
      const toolsWithDefaultImages = fetchedTools.map(tool => ({
        ...tool,
        image: tool.photoURL || DEFAULT_TOOL_IMAGE
      }));
      
      setTools(toolsWithDefaultImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tools';
      setError(errorMessage);
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return {
    tools,
    loading,
    error,
    retry: fetchTools,
  };
}
