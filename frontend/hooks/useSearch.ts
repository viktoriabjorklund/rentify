import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllTools, Tool, DEFAULT_TOOL_IMAGE } from '../services/toolService';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'alpha';

export type SearchState = {
  query: string;
  sort: SortOption;
  tools: Tool[];
  loading: boolean;
  error: string | null;
};

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    sort: 'relevance',
    tools: [],
    loading: true,
    error: null,
  });

  // Fetch tools from API on component mount
  const fetchTools = useCallback(async () => {
    try {
      setSearchState(prev => ({ ...prev, loading: true, error: null }));
      const fetchedTools = await getAllTools();
      
      // Add default image to tools that don't have one
      const toolsWithDefaultImages = fetchedTools.map(tool => ({
        ...tool,
        image: tool.image || DEFAULT_TOOL_IMAGE
      }));
      
      setSearchState(prev => ({ ...prev, tools: toolsWithDefaultImages }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tools';
      setSearchState(prev => ({ ...prev, error: errorMessage }));
      console.error('Error fetching tools:', err);
    } finally {
      setSearchState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // Relevance scoring function
  const getRelevanceScore = useCallback((tool: Tool, query: string) => {
    if (!query) return 0;
    const q = query.trim().toLowerCase();
    let score = 0;
    const nameMatch = tool.name.toLowerCase().includes(q);
    const descMatch = tool.description.toLowerCase().includes(q);
    const locationMatch = tool.location.toLowerCase().includes(q);
    
    if (nameMatch) score += 10; // Name matches are most important
    if (descMatch) score += 5;  // Description matches are important
    if (locationMatch) score += 3; // Location matches are less important
    
    return score;
  }, []);

  // Filter and sort tools based on query and sort option
  const filteredTools = useMemo(() => {
    const { query, sort, tools } = searchState;
    const q = query.trim().toLowerCase();
    
    let list = tools.filter((tool) => 
      tool.name.toLowerCase().includes(q) || 
      tool.description.toLowerCase().includes(q) || 
      tool.location.toLowerCase().includes(q)
    );

    if (sort === "relevance") {
      list = [...list].sort((a, b) => {
        const scoreA = getRelevanceScore(a, query);
        const scoreB = getRelevanceScore(b, query);
        if (scoreA !== scoreB) return scoreB - scoreA; // Higher scores first
        return a.name.localeCompare(b.name, "sv"); // Secondary sort by name
      });
    } else if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "sv"));
    }

    return list;
  }, [searchState.query, searchState.sort, searchState.tools, getRelevanceScore]);

  // Actions
  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setSearchState(prev => ({ ...prev, sort }));
  }, []);

  const retry = useCallback(() => {
    fetchTools();
  }, [fetchTools]);

  return {
    // State
    query: searchState.query,
    sort: searchState.sort,
    tools: filteredTools,
    loading: searchState.loading,
    error: searchState.error,
    
    // Actions
    setQuery,
    setSort,
    retry,
  };
}
