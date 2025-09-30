import { useCallback } from 'react';

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

export function useAuthValidation() {
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

  return {
    validateLoginForm,
    validateRegisterForm,
  };
}
