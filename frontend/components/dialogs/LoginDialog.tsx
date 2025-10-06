import React from 'react';
import { Dialog, DialogButton, DialogButtonGroup } from '../Dialog';
import { useRouter } from 'next/router';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
  onCreateAccount?: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ 
  isOpen, 
  onClose, 
  onLogin,
  onCreateAccount 
}) => {
  const router = useRouter();

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      router.push('/login');
    }
  };

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      router.push('/createaccount');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Login Required"
      size="sm"
    >
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ooopss!
          </h3>
          <p className="text-gray-600">
            You need to log in to send this request.
          </p>
        </div>

        <DialogButtonGroup>
          <DialogButton variant="primary" onClick={handleLogin}>
            Login
          </DialogButton>
          <DialogButton variant="primary" onClick={handleCreateAccount}>
            Create Account
          </DialogButton>
        </DialogButtonGroup>
      </div>
    </Dialog>
  );
};
