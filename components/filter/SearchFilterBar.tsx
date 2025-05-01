import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchFilterBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search artist, track or album...",
}: SearchFilterBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center w-full px-3 py-2 border rounded-lg transition-all duration-200 
          ${
            isFocused
              ? "border-blue-500 shadow-sm ring-2 ring-blue-100"
              : "border-gray-300"
          }`}
      >
        <Search className="w-5 h-5 text-gray-500" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-3 py-1 text-gray-800 bg-transparent outline-none"
          aria-label="Search songs"
        />

        {value && (
          <button
            onClick={handleClear}
            className="p-1 text-gray-400 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
