import { useMemo } from "react";
import { Tool } from "../../services/toolService";
import { filterTools, filterToolsByCategory } from "../utils/searchUtils";

export function useSearchFilter(
  tools: Tool[],
  query: string,
  category: string,
  city: string
) {
  const filteredTools = useMemo(() => {
    const categoryFiltered = filterToolsByCategory(tools, category);
    const cityFiltered = filterToolsByCity(categoryFiltered, city);
    return filterTools(cityFiltered, query);
  }, [tools, query, category, city]);

  return filteredTools;
}

function filterToolsByCity(tools: Tool[], city: string): Tool[] {
  if (city === "all") return tools;
  
  return tools.filter(tool => {
    if (!tool.location) return false;
    // Handle both "City" and "City, Municipality" formats
    const toolCity = tool.location.split(',')[0].trim().toLowerCase();
    return toolCity === city.toLowerCase();
  });
}
