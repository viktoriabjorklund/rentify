// AuthCard: Reusable white rounded container for authentication forms (Login/Register) and similar pages.
// Provides consistent padding, shadow, and max width for form content.
import * as React from 'react';

type AuthCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <div className={`w-full max-w-md md:max-w-lg rounded-2xl bg-white shadow-lg p-6 md:p-8 ${className}`.trim()}>
      {children}
    </div>
  );
}


