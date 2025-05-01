import React from "react";

interface ButtonRangeSelectorProps {
  id: string;
  label: string;
  options: {
    value: string;
    label: string;
    min: number;
    max: number;
  }[];
  selectedValue: string;
  onChange: (id: string, value: string, min: number, max: number) => void;
  icon?: React.ReactNode;
}

export default function ButtonRangeSelector({
  id,
  label,
  options,
  selectedValue,
  onChange,
  icon,
}: ButtonRangeSelectorProps) {
  const handleChange = (value: string) => {
    const option = options.find((opt) => opt.value === value);
    if (option) {
      onChange(id, value, option.min, option.max);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2 text-blue-500">{icon}</span>}
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>

      <div className="flex w-full overflow-hidden border border-gray-200 rounded-lg">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value)}
            className={`
              flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-200
              ${index > 0 ? "border-l border-gray-200" : ""}
              ${
                selectedValue === option.value
                  ? "bg-blue-500 text-white shadow-inner"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
