import React, { useEffect, useRef } from 'react';
import PrimaryButton from './PrimaryButton';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Dialog: React.FC<DialogProps> = ({ 
  isOpen, 
  onClose, 
  title,
  children, 
  showCloseButton = true,
  size = 'md'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div 
        ref={dialogRef}
        className={`
          relative bg-white rounded-lg shadow-xl p-6 mx-4 w-full
          ${sizeClasses[size]}
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}

        {/* Title */}
        {title && (
          <h2 
            id="dialog-title"
            className="text-xl font-semibold text-gray-900 mb-4 pr-8"
          >
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

// Button Components for Dialogs
export const DialogButton: React.FC<{
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', children, disabled = false }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-[#2FA86E] text-white hover:bg-[#27935F] focus:ring-emerald-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "text-white focus:ring-red-500"
  };

  const getButtonStyle = () => {
    if (variant === 'danger') {
      return {
        backgroundColor: '#E95A5A',
        '--hover-bg': '#D54A4A'
      } as React.CSSProperties;
    }
    return {};
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${variant === 'danger' ? 'hover:opacity-90' : ''}`}
      style={getButtonStyle()}
    >
      {children}
    </button>
  );
};

export const DialogButtonGroup: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex gap-3 justify-center mt-6">
      {children}
    </div>
  );
};
