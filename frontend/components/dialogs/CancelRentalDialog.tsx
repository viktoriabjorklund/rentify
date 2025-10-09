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
    >
      <div className="text-center">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#E95A5A' }}>
          Are you sure you want to cancel {rentalInfo}?
          </h3>
        </div>

        <DialogButtonGroup>
          <DialogButton variant="danger" onClick={handleCancel}>
            Yes, Cancel {rentalInfo}
          </DialogButton>
          <DialogButton variant="primary" onClick={handleConfirm}>
            No, Keep {rentalInfo}
          </DialogButton>
        </DialogButtonGroup>
      </div>
    </Dialog>
  );
};
