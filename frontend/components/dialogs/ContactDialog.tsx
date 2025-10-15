import React from "react";
import { Dialog, DialogButton, DialogButtonGroup } from "../Dialog";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEmail?: () => void;
  email?: string;
  ownerName?: string;
}

export const ContactDialog: React.FC<ContactDialogProps> = ({
  isOpen,
  onClose,
  onEmail,
  email,
  ownerName = "Owner",
}) => {
  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    } else {
      // Default behavior - open email client
      if (email) window.open(`mailto:${email}`, "_self");
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-emerald-900 mb-2">
            Contact {ownerName}
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-emerald-900">
                {email ?? "No email available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
