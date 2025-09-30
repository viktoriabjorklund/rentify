import { useMemo } from 'react';
import { Tool } from '../../services/toolService';
import { filterTools } from '../utils/searchUtils';

export function useSearchFilter(tools: Tool[], query: string) {
  const filteredTools = useMemo(() => {
    return filterTools(tools, query);
  }, [tools, query]);

  return filteredTools;
}
