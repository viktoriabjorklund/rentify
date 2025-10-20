const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
import { API_URL } from "../api.js"
import { useEffect, useState } from "react";


export type User = {
  id: number;
  username: string;
  name?: string;
  surname?: string;
};

export type AuthResponse = {
  token: string;
  user?: User;
};

export type RegisterData = {
  username: string;
  password: string;
  name: string;
  surname: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export async function registerUser(data: RegisterData): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

export function storeToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function storeUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (err) {
    console.error("Error decoding token", err);
    return true; // behandla som ogiltig om något går fel
  }
}

export function useAuth() {
  const [user, setUser] = useState<ReturnType<typeof getStoredUser> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedToken && !isTokenExpired(storedToken) && storedUser) {
      setUser(storedUser);
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      removeToken();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return { user, token, isLoading, isAuthenticated, logout };
}
