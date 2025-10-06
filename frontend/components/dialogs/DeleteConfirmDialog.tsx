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
  itemName = "this ad"
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
      title="Confirm Deletion"
      size="sm"
    >
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete {itemName}?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone. Are you sure you want to delete {itemName}?
          </p>
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
