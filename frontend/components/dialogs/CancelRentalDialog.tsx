import React from 'react';
import { Dialog, DialogButton, DialogButtonGroup } from '../Dialog';

interface CancelRentalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  rentalInfo?: string;
}

export const CancelRentalDialog: React.FC<CancelRentalDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCancel,
  onConfirm,
  rentalInfo = "this rental"
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      console.log("Rental canceled!");
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Rental"
      size="sm"
    >
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cancel Rental?
          </h3>
          <p className="text-gray-600">
            Are you sure you want to cancel {rentalInfo}? This action may not be reversible.
          </p>
        </div>

        <DialogButtonGroup>
          <DialogButton variant="danger" onClick={handleCancel}>
            Yes, Cancel Rental
          </DialogButton>
          <DialogButton variant="primary" onClick={handleConfirm}>
            No, Keep Rental
          </DialogButton>
        </DialogButtonGroup>
      </div>
    </Dialog>
  );
};
