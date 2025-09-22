// FormField: Reusable label + input + error helper for forms.
// Supports type="password" with a built-in show/hide toggle for auth pages.
import * as React from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export default function FormField({ id, label, type = 'text', value, onChange, error }: FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label htmlFor={id} className="block text-md font-medium text-[#174B33] mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`w-full rounded-md border border-[#174B33] px-3 py-2 ${isPassword ? 'pr-12' : ''} outline-none focus:ring-2 focus:ring-[#2FA86E] focus:border-[#2FA86E]`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto text-sm text-[#174B33] transition hover:text-black cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}


