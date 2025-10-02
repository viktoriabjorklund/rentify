import React from "react";
import { useRouter } from "next/router";
import ToolList from "../components/ToolList";
import { useAuth } from "../hooks/auth";
import { useYourTools } from "../hooks/tools";


function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-full max-w-xs">
      <span className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 flex items-center justify-center" aria-hidden>🔍</span>
      <input
        type="search"
        placeholder="Search in your ads..."
        aria-label="Search"
        className="w-full rounded-full bg-white px-10 py-2 text-sm shadow-sm ring-1 ring-black/10 placeholder:text-neutral-500 focus:outline-none focus:ring-2"
        style={{ '--tw-ring-color': '#2FA86E' } as React.CSSProperties}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}


export default function YourToolsPage() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { query, setQuery, tools, loading, error, retry } = useYourTools();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </main>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
        <div className="text-center py-8">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-emerald-900 w-full text-left">Your Ads</h1>
        
        <div className="w-full flex justify-start">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600 mt-2">Loading tools...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">An error occurred: {error}</p>
            <button 
              onClick={retry} 
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {query ? `No tools found for "${query}"` : "No tools available"}
            </p>
          </div>
        ) : (
          <ToolList tools={tools} />
        )}
    </main>
  );
}
