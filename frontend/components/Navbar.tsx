import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth";
import PrimaryButton from "./PrimaryButton";

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing auth-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render auth-dependent content until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <header
        className="sticky top-0 z-50 w-full"
        style={{ backgroundColor: "#3A7858" }}
      >
        <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          <Link href="/" className="text-white text-xl font-bold">
            Rentify
          </Link>
          <span className="text-white">Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "#3A7858" }}
    >
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <Link
          href="/"
          className="font-extrabold tracking-tight text-xl text-white"
        >
          Rentify
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-white/90 text-sm font-normal">
            <Link href="#" className="hover:text-white">
              Contact
            </Link>
            <Link href="#" className="hover:text-white">
              FAQ
            </Link>
          </nav>
          
          {isLoading ? (
            <div className="rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-gray-400">
              Loading...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-white text-sm">
                    Welcome, {user?.name || user?.username || 'User'}!
                  </span>
                  <Link href="/yourtools">
                    <PrimaryButton size="sm">My Ads</PrimaryButton>
                  </Link>
                  <PrimaryButton 
                    size="sm" 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <PrimaryButton size="sm">Login</PrimaryButton>
                  </Link>
                  <Link 
                    href="/createaccount"
                    className="rounded-full px-4 py-1.5 text-sm font-semibold text-[#2FA86E] bg-white hover:bg-gray-100 shadow-sm transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
