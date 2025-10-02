import { useState, useCallback } from 'react';
import { loginUser, storeToken, storeUser, LoginData } from '../../services/authService';
import { updateAuthState } from './useAuthState';
import { useAuthValidation, AuthFormData } from './useAuthValidation';

export function useAuthLogin() {
  const [loading, setLoading] = useState(false);
  const { validateLoginForm } = useAuthValidation();

  const login = useCallback(async (formData: AuthFormData) => {
    const validationErrors = validateLoginForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      return { success: false, errors: validationErrors };
    }

    setLoading(true);

    try {
      const loginData: LoginData = {
        username: formData.email,
        password: formData.password,
      };

      const response = await loginUser(loginData);
      storeToken(response.token);
      if (response.user) {
        storeUser(response.user);
      }
      
      updateAuthState({
        user: response.user || null,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, errors: {} };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, errors: { email: errorMessage } };
    } finally {
      setLoading(false);
    }
  }, [validateLoginForm]);

  return {
    login,
    loading,
  };
}
