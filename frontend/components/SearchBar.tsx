import React, { useState, FormEvent } from "react";

export interface SearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search for tools..",
  initialQuery = "",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch?.(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-2xl ${className}`}>
      <div className="flex items-center gap-3 rounded-full bg-white shadow-md ring-1 ring-black/5 px-5 py-3">
        <span aria-hidden className="text-gray-500 text-xl">
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full text-gray-500 w-20 h-6 transition-colors"
          aria-label="Search"
        ></button>
      </div>
    </form>
  );
}
