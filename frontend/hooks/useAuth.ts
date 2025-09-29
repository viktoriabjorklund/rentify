import { useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, getStoredToken, storeToken, removeToken, User, RegisterData, LoginData } from '../services/authService';

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
};

export type AuthErrors = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      // Token exists, assume it's valid for now
      setAuthState({
        user: null, // We'll need to fetch user data
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const validateLoginForm = useCallback((data: AuthFormData): AuthErrors => {
    const newErrors: AuthErrors = {};
    if (!data.email) newErrors.email = 'Email is required';
    if (!data.password) newErrors.password = 'Password is required';
    return newErrors;
  }, []);

  const validateRegisterForm = useCallback((data: AuthFormData): AuthErrors => {
    const newErrors: AuthErrors = {};
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';
    if (!data.email) newErrors.email = 'Email is required';
    if (!data.password) newErrors.password = 'Password is required';
    if (!data.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  }, []);

  const login = useCallback(async (formData: AuthFormData) => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }

    setLoading(true);
    setErrors({});

    try {
      const loginData: LoginData = {
        username: formData.email,
        password: formData.password,
      };

      const response = await loginUser(loginData);
      storeToken(response.token);
      
      setAuthState({
        user: response.user || null,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setErrors({ email: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateLoginForm]);

  const register = useCallback(async (formData: AuthFormData) => {
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }

    setLoading(true);
    setErrors({});

    try {
      const registerData: RegisterData = {
        username: formData.email,
        password: formData.password,
        name: formData.firstName!,
        surname: formData.lastName!,
      };

      await registerUser(registerData);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      if (errorMessage.includes('already taken')) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setErrors({ email: errorMessage });
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateRegisterForm]);

  const logout = useCallback(() => {
    removeToken();
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    setErrors({});
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    // State
    ...authState,
    loading,
    errors,
    
    // Actions
    login,
    register,
    logout,
    clearErrors,
  };
}
