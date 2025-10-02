import { useCallback } from 'react';
import { removeToken } from '../../services/authService';
import { updateAuthState } from './useAuthState';

export function useAuthLogout() {
  const logout = useCallback(() => {
    removeToken();
    updateAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return { logout };
}
