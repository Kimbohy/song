import { useState } from "react";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";

interface SortOption {
  id: string;
  label: string;
}

interface SortOptionsSelectorProps {
  options: SortOption[];
  currentSort: string;
  currentOrder: "ASC" | "DESC";
  onSortChange: (sort: string) => void;
  onOrderChange: (order: "ASC" | "DESC") => void;
}

export default function SortOptionsSelector({
  options,
  currentSort,
  currentOrder,
  onSortChange,
  onOrderChange,
}: SortOptionsSelectorProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Sort by"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onOrderChange(currentOrder === "DESC" ? "ASC" : "DESC")}
        className="flex items-center justify-center px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
        aria-label={
          currentOrder === "DESC" ? "Sort ascending" : "Sort descending"
        }
      >
        {currentOrder === "DESC" ? (
          <>
            <ArrowDownNarrowWide className="w-4 h-4 mr-2" />
            <span>Highest First</span>
          </>
        ) : (
          <>
            <ArrowUpNarrowWide className="w-4 h-4 mr-2" />
            <span>Lowest First</span>
          </>
        )}
      </button>
    </div>
  );
}
