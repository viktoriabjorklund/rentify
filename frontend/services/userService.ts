const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
// Model layer in MVVM. Can reuse this code instead of writing it again.
export type User = {
    id: number;
    username: string;
    name?: string;
    surname?: string;
};


export async function deleteUser(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete user (status ${res.status})`);
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');
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