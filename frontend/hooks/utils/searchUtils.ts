import { Tool } from '../../services/toolService';

/**
 * Calculate relevance score for a tool based on search query
 * Used by both useSearch and useYourTools
 */
export function getRelevanceScore(tool: Tool, query: string): number {
  if (!query) return 0;
  
  const queryLower = query.trim().toLowerCase();
  let score = 0;
  
  const nameMatch = tool.name.toLowerCase().includes(queryLower);
  const descMatch = tool.description.toLowerCase().includes(queryLower);
  const locationMatch = tool.location?.toLowerCase().includes(queryLower);
  
  // Scoring weights
  if (tool.name.toLowerCase() === queryLower) {
    score += 100; // Exact name match
  } else if (nameMatch) {
    score += 50; // Name contains query
  }
  
  if (descMatch) {
    score += 30; // Description contains query
  }
  
  if (locationMatch) {
    score += 20; // Location contains query
  }
  
  return score;
}

/**
 * Filter tools based on search query
 */
export function filterTools(tools: Tool[], query: string): Tool[] {
  const q = query.trim().toLowerCase();
  
  return tools.filter((tool) => 
    tool.name.toLowerCase().includes(q) || 
    tool.description.toLowerCase().includes(q) || 
    tool.location?.toLowerCase().includes(q)
  );
}
