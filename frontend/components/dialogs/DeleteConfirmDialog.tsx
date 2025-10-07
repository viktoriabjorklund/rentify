import React from 'react';
import { Dialog, DialogButton, DialogButtonGroup } from '../Dialog';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  itemName?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ 
  isOpen, 
  onClose, 
  onDelete,
  itemName = "your ad"
}) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      console.log("Item deleted!");
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
          Are you sure you want to delete {itemName}?
          </h3>
        </div>

        <DialogButtonGroup>
          <DialogButton variant="secondary" onClick={onClose}>
            Cancel
          </DialogButton>
          <DialogButton variant="danger" onClick={handleDelete}>
            Delete
          </DialogButton>
        </DialogButtonGroup>
      </div>
    </Dialog>
  );
};
