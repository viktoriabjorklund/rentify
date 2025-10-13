import { useState, useCallback } from "react";
import { SortOption } from "./useSearchSort";

export function useSearchState() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [category, setCategory] = useState("all");

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const updateSort = useCallback((newSort: SortOption) => {
    setSort(newSort);
  }, []);

  const updateCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  return {
    query,
    sort,
    category,
    setQuery: updateQuery,
    setSort: updateSort,
    setCategory: updateCategory,
  };
}
