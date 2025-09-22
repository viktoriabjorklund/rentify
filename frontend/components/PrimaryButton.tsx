// PrimaryButton: Shared green call-to-action button used across the app (e.g., Login/Register).
// Encapsulates consistent colors, hover states, focus ring, and size variants.
import * as React from 'react';

type PrimaryButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: 'sm' | 'md';
};

export default function PrimaryButton({
  children,
  type = 'button',
  disabled,
  onClick,
  className = '',
  size = 'md',
}: PrimaryButtonProps) {
  const sizeClasses = size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-7 py-2.5 text-sm';
  const baseClasses = `rounded-full font-semibold text-white bg-[#2FA86E] hover:bg-[#27935F] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 cursor-pointer`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${sizeClasses} ${baseClasses} ${className}`.trim()}
    >
      {children}
    </button>
  );
}


