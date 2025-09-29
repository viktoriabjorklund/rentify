const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
// Model layer in MVVM. Can reuse this code instead of writing it again.
export type Tool = {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  user: {
    id: number;
    username: string;
    name?: string;
    surname?: string;
  };
  createdAt: string;
};

export async function getAllTools(): Promise<Tool[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tools`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tools: ${response.statusText}`);
    }

    const tools = await response.json();
    return tools;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
}

// Default tool image URL - you can change this to any image you prefer
export const DEFAULT_TOOL_IMAGE = '';
