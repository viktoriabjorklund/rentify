const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export type Request = {
  requestId: number;
  startDate: Date;
  endDate: Date;
  toolId: number;
};

export type RequestData = {
  renterId?: number;
  startDate: any[];
  endDate: any[];
  toolId?: number;
  pending: Boolean;
  accepted: Boolean;
};

export async function createRequest(data: RequestData): Promise<Request> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/requests/${[data.toolId]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
}