import { useState, useEffect } from 'react';
import { getStoredToken, getStoredUser, removeToken, User } from '../../services/authService';

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

// Global state management
let globalAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authStateListeners = new Set<() => void>();

export const updateAuthState = (newState: AuthState) => {
  globalAuthState = newState;
  authStateListeners.forEach(listener => listener());
};

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>(globalAuthState);

  // Subscribe to global state changes
  useEffect(() => {
    const listener = () => {
      setAuthState({ ...globalAuthState });
    };
    authStateListeners.add(listener);
    return () => {
      authStateListeners.delete(listener);
    };
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (authState.isLoading) {
      const token = getStoredToken();
      const user = getStoredUser();
      
      if (token) {
        updateAuthState({
          user: user || null,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        updateAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
        if (user) {
          localStorage.removeItem('user');
        }
      }
    }
  }, [authState.isLoading]);

  return authState;
}
