// Main useSearch hook - composes data, filtering, sorting, and state
import { useSearchData } from "./useSearchData";
import { useSearchState } from "./useSearchState";
import { useSearchFilter } from "./useSearchFilter";
import { useSearchSort } from "./useSearchSort";

// Re-export types for backward compatibility
export type { SortOption } from "./useSearchSort";

export function useSearch() {
  // Get search state (query, sort, category)
  const { query, sort, category, setQuery, setSort, setCategory } =
    useSearchState();

  // Get data from API
  const { tools: allTools, loading, error, retry } = useSearchData();

  // Filter tools based on query and category
  const filteredTools = useSearchFilter(allTools, query, category);

  // Sort filtered tools
  const sortedTools = useSearchSort(filteredTools, sort, query);

  return {
    // State
    query,
    sort,
    category,
    tools: sortedTools,
    loading,
    error,

    // Actions
    setQuery,
    setSort,
    setCategory,
    retry,
  };
}
