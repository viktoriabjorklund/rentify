import React from 'react';
import { Dialog, DialogButton, DialogButtonGroup } from '../Dialog';

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCall?: () => void;
  onEmail?: () => void;
  phoneNumber?: string;
  email?: string;
  ownerName?: string;
}

export const ContactDialog: React.FC<ContactDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCall,
  onEmail,
  phoneNumber = "test number",
  email = "test@test.com",
  ownerName = "Owner"
}) => {
  const handleCall = () => {
    if (onCall) {
      onCall();
    } else {
      // Default behavior - open phone app
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    } else {
      // Default behavior - open email client
      window.open(`mailto:${email}`, '_self');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Owner"
      size="sm"
    >
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Contact {ownerName}
          </h3>
          <p className="text-gray-600 mb-4">
            Choose how you'd like to reach out to the owner.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">{phoneNumber}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
