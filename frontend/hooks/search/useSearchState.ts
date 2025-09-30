import { useState, useCallback } from 'react';
import { SortOption } from './useSearchSort';

export function useSearchState() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('relevance');

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const updateSort = useCallback((newSort: SortOption) => {
    setSort(newSort);
  }, []);

  return {
    query,
    sort,
    setQuery: updateQuery,
    setSort: updateSort,
  };
}
