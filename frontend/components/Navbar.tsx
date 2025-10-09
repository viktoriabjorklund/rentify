import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth";
import { useNotifications } from "../hooks/useNotifications";
import PrimaryButton from "./PrimaryButton";

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count: notificationCount } = useNotifications();

  useEffect(() => setMounted(true), []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.profile-dropdown')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-[#3A7858]">
        <div className="flex items-center justify-between h-14 px-6">
          <Link href="/" className="text-white text-xl font-bold">
            Rentify
          </Link>
          <span className="text-white">Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#3A7858]">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold tracking-tight text-xl text-white"
        >
          Rentify
        </Link>

        {/* Right side */}
        {isAuthenticated && !isLoading ? (
          <div className="flex items-center gap-6 relative">
            {/* Add icon */}
            <div className="relative group">
              <Link href="/addtool" className="hover:opacity-80 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#2FA86E] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Create ad
              </div>
            </div>

            {/* Bookings icon with badge */}
            <div className="relative group">
              <Link href="/bookings">
                <svg className="w-6 h-6 text-white hover:opacity-80 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#2FA86E] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Bookings
              </div>
            </div>

            {/* Profile dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 hover:opacity-80 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">
                  <svg className="w-5 h-5 text-[#3A7858]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg 
                  className={`w-4 h-4 text-white transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md text-sm overflow-hidden">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/yourtools"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    My ads
                  </Link>

                  <Link
                    href="/bookings"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Bookings
                  </Link>

                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    style={{ color: '#E95A5A' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <PrimaryButton size="sm">Login</PrimaryButton>
            </Link>
            <Link href="/createaccount">
              <PrimaryButton size="sm">
                Sign Up
              </PrimaryButton>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
