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
}) => {
  const router = useRouter();

  const handleLogin = () => {
 {
      router.push('/login');
    }
  };

  const handleCreateAccount = () => { {
      router.push('/createaccount');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-center">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-emerald-900 mb-2">
          Oops! You need to login to send this request.
          </h3>
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
