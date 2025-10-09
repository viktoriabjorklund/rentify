const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
// Model layer in MVVM. Can reuse this code instead of writing it again.
export type User = {
    id: number;
    username: string;
    name?: string;
    surname?: string;
};


export async function deleteUser(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tool: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}

export async function displayUser(id: number): Promise<User> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tool: ${response.statusText}`);
    }

    const user = await response.json();
    return user
  } catch (error) {
    console.error('Error fetching tool:', error);
    throw error;
  }
}