const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
import { API_URL } from "../api.js";

// Model layer in MVVM. Can reuse this code instead of writing it again.
export type Tool = {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  category?: string;
  photoURL?: string;
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
    const response = await fetch(`${API_URL}/api/tools`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tools: ${response.statusText}`);
    }

    const tools = await response.json();
    return tools;
  } catch (error) {
    console.error("Error fetching tools:", error);
    throw error;
  }
}

export async function searchTools(query: string): Promise<Tool[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/tools/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search tools: ${response.statusText}`);
    }

    const tools = await response.json();
    return tools;
  } catch (error) {
    console.error("Error searching tools:", error);
    throw error;
  }
}

export async function getUserTools(): Promise<Tool[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/tools/mytools`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user tools: ${response.statusText}`);
    }

    const userTools = await response.json();
    return userTools;
  } catch (error) {
    console.error("Error fetching user tools:", error);
    throw error;
  }
}

export async function createTool(data: {
  name: string;
  price: number;
  location: string;
  description?: string;
  category?: string;
  photo?: File;
}): Promise<Tool> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("location", data.location);
    if (data.description) formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);
    if (data.photo) formData.append("photo", data.photo);

    const response = await fetch(`${API_URL}/api/tools`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to create tool: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating tool:", error);
    throw error;
  }
}

export async function updateTool(
  id: number,
  data: { 
    name?: string; 
    description?: string; 
    price?: number; 
    location?: string;
    category?: string;
    photo?: File;
  }
): Promise<Tool> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', String(data.price));
    if (data.location !== undefined) formData.append('location', data.location);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.photo) formData.append('photo', data.photo);

    const response = await fetch(`${API_URL}/api/tools/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update tool: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating tool:", error);
    throw error;
  }
}

export async function deleteTool(id: number): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/tools/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tool: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting tool:", error);
    throw error;
  }
}

export async function displayTool(id: number): Promise<Tool> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/tools/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tool: ${response.statusText}`);
    }

    const userTool = await response.json();
    return userTool;
  } catch (error) {
    console.error("Error fetching tool:", error);
    throw error;
  }
}

// Default tool image URL - you can change this to any image you prefer
export const DEFAULT_TOOL_IMAGE = "";
