import { useState } from "react";

interface TimeFilterProps {
  onFilterChange: (period: string) => void;
  defaultFilter?: string;
}

export default function TimeFilter({
  onFilterChange,
  defaultFilter = "all",
}: TimeFilterProps) {
  const [activePeriod, setActivePeriod] = useState(defaultFilter);

  const periods = [
    { id: "all", label: "All Time" },
    { id: "year", label: "Past Year" },
    { id: "month", label: "Past Month" },
    { id: "week", label: "Past Week" },
  ];

  const handleFilterChange = (period: string) => {
    setActivePeriod(period);
    onFilterChange(period);
  };

  return (
    <div className="inline-flex bg-gray-100 p-1 rounded-lg">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => handleFilterChange(period.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            activePeriod === period.id
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
