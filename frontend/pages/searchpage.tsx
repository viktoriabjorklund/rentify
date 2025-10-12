import React from "react";
import ToolList from "../components/ToolList";
import { useSearch, SortOption } from "../hooks/search";

function SortMenu({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-[#2FA86E] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#27935F] focus:outline-none focus-visible:ring-2"
        style={{ "--tw-ring-color": "#2FA86E" } as React.CSSProperties}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        Sort <span className="text-xs">▼</span>
      </button>
      {/* Simple popover-less select for now — keep API stable */}
      <select
        aria-label="Sort options"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price: Lowest first</option>
        <option value="price-desc">Price: Highest first</option>
        <option value="alpha">A–Ö</option>
      </select>
    </div>
  );
}

function CategoryMenu({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Function to get display name for category
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "all":
        return "All Categories";
      case "electronics":
        return "Electronics";
      case "furniture":
        return "Furniture";
      case "tools":
        return "Tools";
      case "other":
        return "Other";
      default:
        return "Category";
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-[#2FA86E] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#27935F] focus:outline-none focus-visible:ring-2"
        style={{ "--tw-ring-color": "#2FA86E" } as React.CSSProperties}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        {getCategoryDisplayName(value)} <span className="text-xs">▼</span>
      </button>
      {/* Simple popover-less select for now — keep API stable */}
      <select
        aria-label="Category options"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="furniture">Furniture</option>
        <option value="tools">Tools</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full max-w-xl">
      <span
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
        aria-hidden
      >
        🔍
      </span>
      <input
        type="search"
        placeholder="Search..."
        aria-label="Search"
        className="w-full rounded-full bg-white px-12 py-2 text-sm shadow-sm ring-1 ring-black/10 placeholder:text-neutral-500 focus:outline-none focus:ring-2"
        style={{ "--tw-ring-color": "#2FA86E" } as React.CSSProperties}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span
        className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 flex items-center justify-center"
        aria-hidden
      >
        ☰
      </span>
    </div>
  );
}

export default function SearchPage() {
  const {
    query,
    sort,
    category,
    tools,
    loading,
    error,
    setQuery,
    setSort,
    setCategory,
    retry,
  } = useSearch();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
      <h1
        className="mb-6 text-center text-6xl font-extrabold tracking-tight text-emerald-900 md:text-7xl"
        style={{
          fontFamily:
            "ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        Rentify
      </h1>

      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <SortMenu value={sort} onChange={setSort} />
            <CategoryMenu value={category} onChange={setCategory} />
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="w-20"></div>
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
