import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { SortOption } from "./useSearchSort";

export function useSearchState() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  // initialize from URL (?q=...)
  useEffect(() => {
    const q = typeof router.query.q === "string" ? router.query.q : "";
    if (q) setQuery(q);
  }, [router.query.q]);

  const updateSort = useCallback((newSort: SortOption) => {
    setSort(newSort);
  }, []);

  const updateCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  const updateCity = useCallback((newCity: string) => {
    setCity(newCity);
  }, []);

  return {
    query,
    sort,
    category,
    city,
    setQuery: updateQuery,
    setSort: updateSort,
    setCategory: updateCategory,
    setCity: updateCity,
  };
}
