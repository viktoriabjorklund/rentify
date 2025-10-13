import { useMemo } from "react";
import { Tool } from "../../services/toolService";
import { filterTools, filterToolsByCategory } from "../utils/searchUtils";

export function useSearchFilter(
  tools: Tool[],
  query: string,
  category: string
) {
  const filteredTools = useMemo(() => {
    const categoryFiltered = filterToolsByCategory(tools, category);
    return filterTools(categoryFiltered, query);
  }, [tools, query, category]);

  return filteredTools;
}
