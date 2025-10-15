const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type BackendUser = {
  id: number;
  username: string;
  name?: string;
  surname?: string;
};

export type BackendTool = {
  id: number;
  name: string;
  location?: string;
  price?: number;
  user?: BackendUser;
};

export type BackendRequest = {
  id: number;
  renterId: number;
  toolId: number;
  tool?: BackendTool;
  renter?: BackendUser;
  startDate: string;
  endDate: string;
  pending: boolean;
  accepted: boolean;
  price?: number;
  viewed?: boolean;
};

export type RequestData = {
  startDate: Date;
  endDate: Date;
  toolId?: number;
  price: number;
  pending: Boolean;
  accepted: Boolean;
};

export async function createRequest(data: RequestData): Promise<BackendRequest> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/requests/`, {
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

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getSentRequests(): Promise<BackendRequest[]> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/api/requests/sent`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch sent requests: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

export async function getReceivedRequests(): Promise<BackendRequest[]> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/api/requests/recieved`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch recieved requests: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

export async function markRequestAsViewed(id: number): Promise<void> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/api/requests/${id}/viewed`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to mark request as viewed: ${res.status} ${res.statusText}`
    );
  }
}

export async function updateRequestStatus(
  requestId: number,
  data: { pending: boolean; accepted: boolean }
): Promise<BackendRequest> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error ||
        `Failed to update request status ${requestId}: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

export async function deleteRequest(requestId: number): Promise<void> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error ||
        `Failed to delete request ${requestId}: ${res.status} ${res.statusText}`
    );
  }
}
