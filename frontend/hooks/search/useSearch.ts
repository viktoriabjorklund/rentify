// Main useSearch hook - composes data, filtering, sorting, and state
import { useSearchData } from "./useSearchData";
import { useSearchState } from "./useSearchState";
import { useSearchFilter } from "./useSearchFilter";
import { useSearchSort } from "./useSearchSort";

// Re-export types for backward compatibility
export type { SortOption } from "./useSearchSort";

export function useSearch() {
  // Get search state (query, sort, category, city)
  const { query, sort, category, city, setQuery, setSort, setCategory, setCity } =
    useSearchState();

  // Get data from API
  const { tools: allTools, loading, error, retry } = useSearchData(query);

  // Filter tools based on query, category, and city
  const filteredTools = useSearchFilter(allTools, query, category, city);

  // Sort filtered tools
  const sortedTools = useSearchSort(filteredTools, sort, query);

  return {
    // State
    query,
    sort,
    category,
    city,
    tools: sortedTools,
    loading,
    error,

    // Actions
    setQuery,
    setSort,
    setCategory,
    setCity,
    retry,
  };
}
