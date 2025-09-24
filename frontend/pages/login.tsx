import * as React from 'react';
import { useRouter } from 'next/router';
import PrimaryButton from '@/components/PrimaryButton';
import AuthCard from '@/components/AuthCard';
import FormField from '@/components/FormField';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{email?: string; pw?: string}>({});

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    if (!pw) e.pw = 'Password is required';
    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Using email as username for now
          password: pw,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token (you might want to use localStorage or a proper auth context)
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        const error = await response.json();
        setErrors({ email: error.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
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
              value={pw}
              onChange={setPw}
              error={errors.pw}
            />

            {/* Submit */}
            <div className="flex justify-center">
              <PrimaryButton type="submit" disabled={loading} size="md">
                {loading ? 'Logging in…' : 'Login'}
              </PrimaryButton>
            </div>

            <p className="text-center text-sm text-[#174B33]">
              Don’t have an account?{' '}
              <a href="/createaccount" className="text-[#174B33] hover:underline">
                Register
              </a>
            </p>
          </form>
        </AuthCard>
    </main>
  );
}
