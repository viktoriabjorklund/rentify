// Main useAuth hook - combines state and actions
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

// Re-export types for backward compatibility
export type { AuthState } from './useAuthState';
export type { AuthFormData, AuthErrors } from './useAuthValidation';

export function useAuth() {
  const authState = useAuthState();
  const authActions = useAuthActions();

  return {
    // State from useAuthState
    ...authState,
    
    // Actions from useAuthActions
    ...authActions,
  };
}
