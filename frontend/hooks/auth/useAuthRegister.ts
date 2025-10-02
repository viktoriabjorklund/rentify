import { useState, useCallback } from 'react';
import { registerUser, RegisterData } from '../../services/authService';
import { useAuthValidation, AuthFormData } from './useAuthValidation';

export function useAuthRegister() {
  const [loading, setLoading] = useState(false);
  const { validateRegisterForm } = useAuthValidation();

  const register = useCallback(async (formData: AuthFormData) => {
    const validationErrors = validateRegisterForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      return { success: false, errors: validationErrors };
    }

    setLoading(true);

    try {
      const registerData: RegisterData = {
        username: formData.email,
        password: formData.password,
        name: formData.firstName!,
        surname: formData.lastName!,
      };

      await registerUser(registerData);
      return { success: true, errors: {} };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      let errors = {};
      
      if (errorMessage.includes('already taken')) {
        errors = { email: 'This email is already registered' };
      } else {
        errors = { email: errorMessage };
      }
      
      return { success: false, errors };
    } finally {
      setLoading(false);
    }
  }, [validateRegisterForm]);

  return {
    register,
    loading,
  };
}
