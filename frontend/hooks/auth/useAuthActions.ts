// Main useAuthActions hook - composes login, register, and logout
import { useState, useCallback } from 'react';
import { useAuthLogin } from './useAuthLogin';
import { useAuthRegister } from './useAuthRegister';
import { useAuthLogout } from './useAuthLogout';
import { AuthFormData, AuthErrors } from './useAuthValidation';

export function useAuthActions() {
  const [errors, setErrors] = useState<AuthErrors>({});
  
  // Get individual auth actions
  const { login: loginAction, loading: loginLoading } = useAuthLogin();
  const { register: registerAction, loading: registerLoading } = useAuthRegister();
  const { logout } = useAuthLogout();

  // Wrapper functions that handle error state
  const login = useCallback(async (formData: AuthFormData) => {
    const result = await loginAction(formData);
    setErrors(result.errors);
    return result.success;
  }, [loginAction]);

  const register = useCallback(async (formData: AuthFormData) => {
    const result = await registerAction(formData);
    setErrors(result.errors);
    return result.success;
  }, [registerAction]);

  const logoutWithErrorClear = useCallback(() => {
    logout();
    setErrors({});
  }, [logout]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    loading: loginLoading || registerLoading,
    errors,
    login,
    register,
    logout: logoutWithErrorClear,
    clearErrors,
  };
}
