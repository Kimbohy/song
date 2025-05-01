import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import RangeSlider from "../RangeSlider";

interface Feature {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultLow: number;
  defaultHigh: number;
  color?: string;
  formatValue?: (value: number) => string;
}

interface FeatureFilterGroupProps {
  title: string;
  icon: React.ReactNode;
  features: Feature[];
  onChange: (id: string, low: number, high: number) => void;
}

export default function FeatureFilterGroup({
  title,
  icon,
  features,
  onChange,
}: FeatureFilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 bg-white border border-gray-100 rounded-lg shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 text-left"
      >
        <div className="flex items-center">
          <span className="mr-3 text-blue-500">{icon}</span>
          <h3 className="font-medium text-gray-800 text-md">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <RangeSlider
                key={feature.id}
                min={feature.min}
                max={feature.max}
                step={feature.step}
                defaultLow={feature.defaultLow}
                defaultHigh={feature.defaultHigh}
                label={feature.label}
                formatValue={feature.formatValue}
                onChange={(low, high) => onChange(feature.id, low, high)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
