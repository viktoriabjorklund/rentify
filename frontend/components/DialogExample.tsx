import React from 'react';
import { useDialogs } from '../hooks/dialogs';
import { 
  LoginDialog, 
  ContactDialog, 
  DeleteConfirmDialog, 
  CancelRentalDialog 
} from './dialogs';
import PrimaryButton from './PrimaryButton';

export const DialogExample: React.FC = () => {
  const dialogs = useDialogs();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Dialog Examples</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Login Dialog */}
        <div className="space-y-2">
          <h3 className="font-semibold">Login Dialog</h3>
          <PrimaryButton onClick={dialogs.openLogin}>
            Open Login Dialog
          </PrimaryButton>
        </div>

        {/* Contact Dialog */}
        <div className="space-y-2">
          <h3 className="font-semibold">Contact Dialog</h3>
          <PrimaryButton onClick={dialogs.openContact}>
            Open Contact Dialog
          </PrimaryButton>
        </div>

        {/* Delete Confirm Dialog */}
        <div className="space-y-2">
          <h3 className="font-semibold">Delete Confirm Dialog</h3>
          <PrimaryButton onClick={dialogs.openDeleteConfirm}>
            Open Delete Dialog
          </PrimaryButton>
        </div>

        {/* Cancel Rental Dialog */}
        <div className="space-y-2">
          <h3 className="font-semibold">Cancel Rental Dialog</h3>
          <PrimaryButton onClick={dialogs.openCancelConfirm}>
            Open Cancel Dialog
          </PrimaryButton>
        </div>
      </div>

      {/* All Dialog Components */}
      <LoginDialog
        isOpen={dialogs.isLoginOpen}
        onClose={dialogs.closeLogin}
        onLogin={dialogs.login}
        onCreateAccount={dialogs.createAccount}
      />

      <ContactDialog
        isOpen={dialogs.isContactOpen}
        onClose={dialogs.closeContact}
        onCall={dialogs.callOwner}
        onEmail={dialogs.emailOwner}
      />

      <DeleteConfirmDialog
        isOpen={dialogs.isDeleteConfirmOpen}
        onClose={dialogs.closeDeleteConfirm}
        onDelete={dialogs.deleteAd}
        itemName="this tool"
      />

      <CancelRentalDialog
        isOpen={dialogs.isCancelConfirmOpen}
        onClose={dialogs.closeCancelConfirm}
        onCancel={dialogs.closeCancelConfirm}
        onConfirm={dialogs.cancelRental}
      />
    </div>
  );
};
