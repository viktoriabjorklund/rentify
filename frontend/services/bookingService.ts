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

export type Booking = {
  id: number;      
  requestId: number;     
  renterId:  number;
  toolId:    number;
  startDate: Date;
  endDate:   Date;
  price:     number;
  createdAt: Date;
  renter:    BackendUser ;    
  request:   Request;  
  tool:      BackendTool;     
}

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getBookings(): Promise<Booking[]> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch received requests: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
