import { X, Tag } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface FilterTag {
  id: string;
  label: string;
  value: string;
  onRemove: (id: string) => void;
}

interface FilterTagsProps {
  filters: FilterTag[];
  onReset: () => void;
}

export default function FilterTags({ filters, onReset }: FilterTagsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="mb-6 animate-fadeIn">
      <div className="flex items-center mb-3">
        <Tag className="w-4 h-4 mr-2 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
        {filters.length > 1 && (
          <button
            onClick={onReset}
            className="flex items-center px-2 py-1 ml-3 text-xs font-medium text-red-600 transition-colors bg-red-50 border border-red-100 rounded-md hover:bg-red-100"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100 group transition-all hover:bg-blue-100"
          >
            <span className="mr-1 text-blue-500">{filter.label}:</span>
            <span className="font-semibold">{filter.value}</span>
            <button
              onClick={() => filter.onRemove(filter.id)}
              className="p-0.5 ml-2 text-blue-400 transition-colors rounded-full hover:text-blue-700 hover:bg-blue-200"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
