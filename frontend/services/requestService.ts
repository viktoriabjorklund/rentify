const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export type Request = {
  requestId: number;
  startDate: Date;
  endDate: Date;
  toolId: number;
};

export type RequestData = {
  renterId?: number;
  startDate: Date;
  endDate: Date;
  toolId?: number;
};

export async function createRequest(data: RequestData): Promise<Request> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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