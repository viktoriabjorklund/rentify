import * as React from 'react';

export default function LoginPage() {
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

    // just for now to simulate a loading state
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <div className="min-h-screen grid grid-rows-[64px_1fr_96px] bg-gray-50">
      {/* Navbar placeholder */}
      <header className="h-16 bg-emerald-700 text-white flex items-center justify-between px-6 md:px-8">
        <div className="font-semibold">Rentify</div>
        <nav className="hidden sm:flex gap-6 opacity-80">
          <span>Contact</span>
          <span>FAQ</span>
          <span className="px-4 py-1 rounded-full bg-white/20">Login</span>
        </nav>
      </header>

      {/* Main */}
      <main className="relative flex items-center justify-center px-4 md:px-6">
        {/* soft background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-24 h-80 w-80 md:h-96 md:w-96 rounded-full blur-3xl opacity-30
                          bg-[radial-gradient(closest-side,theme(colors.emerald.300),transparent)]" />
          <div className="absolute right-1/4 bottom-16 h-80 w-80 md:h-96 md:w-96 rounded-full blur-3xl opacity-20
                          bg-[radial-gradient(closest-side,theme(colors.emerald.200),transparent)]" />
        </div>

        <div className="w-full max-w-md md:max-w-lg rounded-2xl bg-white shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-thin text-center text-[#174B33] mb-6">Login</h1>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-md font-medium text-[#174B33] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className="w-full rounded-md border border-[#174B33] px-3 py-2 outline-none
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-md font-medium text-[#174B33] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  aria-invalid={!!errors.pw}
                  className="w-full rounded-md border border-[#174B33] px-3 py-2 pr-12 outline-none
                             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto text-sm text-[#174B33] transition hover:text-black cursor-pointer"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.pw && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.pw}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="block mx-auto w-auto px-7 rounded-full bg-emerald-600 text-white py-2.5 md:py-3 font-medium
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500
                         disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>

            <p className="text-center text-sm text-[#174B33]">
              Don’t have an account?{' '}
              <a href="/register" className="text-[#174B33] hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </main>

      {/* Footer placeholder */}
      <footer className="h-24 bg-emerald-700 text-white flex items-center px-6">
        <span className="text-lg font-semibold">Rentify</span>
      </footer>
    </div>
  );
}
