import { useMemo } from 'react';
import { Tool } from '../../services/toolService';
import { getRelevanceScore } from '../utils/searchUtils';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'alpha';

export function useSearchSort(tools: Tool[], sort: SortOption, query: string) {
  const sortedTools = useMemo(() => {
    const list = [...tools];

    if (sort === "relevance") {
      list.sort((a, b) => {
        const scoreA = getRelevanceScore(a, query);
        const scoreB = getRelevanceScore(b, query);
        if (scoreA !== scoreB) return scoreB - scoreA; // Higher scores first
        return a.name.localeCompare(b.name, "sv"); // Secondary sort by name
      });
    } else if (sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "alpha") {
      list.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    }

    return list;
  }, [tools, sort, query]);

  return sortedTools;
}
