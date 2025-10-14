import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PrimaryButton from '@/components/PrimaryButton';
import AuthCard from '@/components/AuthCard';
import FormField from '@/components/FormField';
import { useAuth } from '../hooks/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { loading, errors, login } = useAuth();


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      router.push('/searchpage');
    }
  }

  return (
    <main
      className="relative flex items-center justify-center px-4 md:px-6 min-h-[calc(100vh-theme(height.14)-theme(spacing.20))] py-10 overflow-hidden"
      style={{ backgroundColor: '#F4F6F5' }}
    >
        {/* Gradient green blobs (match homepage) */}
        <div
          className="pointer-events-none absolute -top-12 right-1/6 h-[620px] w-[620px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(142,221,174,1.0), rgba(142,221,174,0.0))',
          }}
        />
        <div
          className="pointer-events-none absolute -left-10 top-1/3 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(142,221,174,1.0), rgba(142,221,174,0.0))',
          }}
        />

        <AuthCard className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#174B33] mb-6">Login</h1>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />

            {/* Password */}
            <FormField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
            />

            {/* Submit */}
            <div className="flex justify-center">
              <PrimaryButton type="submit" disabled={loading} size="md">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in…
                  </span>
                ) : 'Login'}
              </PrimaryButton>
            </div>

            <p className="text-center text-sm text-[#174B33]">
              Don&apos;t have an account?{' '}
              <Link href="/createaccount" className="text-[#174B33] hover:underline">
                Register
              </Link>
            </p>
          </form>
        </AuthCard>
    </main>
  );
}
