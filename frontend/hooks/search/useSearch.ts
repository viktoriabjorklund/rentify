// Main useSearch hook - composes data, filtering, sorting, and state
import { useSearchData } from './useSearchData';
import { useSearchState } from './useSearchState';
import { useSearchFilter } from './useSearchFilter';
import { useSearchSort } from './useSearchSort';

// Re-export types for backward compatibility
export type { SortOption } from './useSearchSort';

export function useSearch() {
  // Get search state (query, sort)
  const { query, sort, setQuery, setSort } = useSearchState();
  
  // Get data from API
  const { tools: allTools, loading, error, retry } = useSearchData();
  
  // Filter tools based on query
  const filteredTools = useSearchFilter(allTools, query);
  
  // Sort filtered tools
  const sortedTools = useSearchSort(filteredTools, sort, query);

  return {
    // State
    query,
    sort,
    tools: sortedTools,
    loading,
    error,
    
    // Actions
    setQuery,
    setSort,
    retry,
  };
}
