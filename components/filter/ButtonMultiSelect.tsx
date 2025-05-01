import React from "react";
import { X, Check } from "lucide-react";

interface ButtonMultiSelectProps {
  id: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  selectedValues: string[];
  onChange: (id: string, values: string[]) => void;
  allowMultiple?: boolean;
  icon?: React.ReactNode;
}

export default function ButtonMultiSelect({
  id,
  label,
  options,
  selectedValues,
  onChange,
  allowMultiple = true,
  icon,
}: ButtonMultiSelectProps) {
  const handleToggle = (value: string) => {
    let newValues: string[];

    if (allowMultiple) {
      if (selectedValues.includes(value)) {
        newValues = selectedValues.filter((v) => v !== value);
      } else {
        newValues = [...selectedValues, value];
      }
    } else {
      // Single select mode
      newValues = selectedValues.includes(value) ? [] : [value];
    }

    onChange(id, newValues);
  };

  const clearAll = () => {
    onChange(id, []);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-blue-500">{icon}</span>}
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        {selectedValues.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center px-2 py-1 text-xs text-gray-500 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`
                relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                ${
                  isSelected
                    ? "bg-blue-100 text-blue-700 border-blue-200 pl-7 border"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }
              `}
            >
              {isSelected && (
                <Check className="absolute w-4 h-4 text-blue-500 left-2 top-2.5" />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
