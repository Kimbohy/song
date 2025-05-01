import { useState, useEffect } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  defaultLow: number;
  defaultHigh: number;
  label: string;
  formatValue?: (value: number) => string;
  onChange: (low: number, high: number) => void;
}

export default function RangeSlider({
  min,
  max,
  step,
  defaultLow,
  defaultHigh,
  label,
  formatValue = (value) => value.toString(),
  onChange,
}: RangeSliderProps) {
  const [low, setLow] = useState(defaultLow);
  const [high, setHigh] = useState(defaultHigh);

  useEffect(() => {
    onChange(low, high);
  }, [low, high, onChange]);

  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLow = parseFloat(e.target.value);
    setLow(newLow > high ? high : newLow);
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHigh = parseFloat(e.target.value);
    setHigh(newHigh < low ? low : newHigh);
  };

  // Calculate position percentage for range track highlighting
  const lowPercent = ((low - min) / (max - min)) * 100;
  const highPercent = ((high - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="text-xs text-gray-500">
          {formatValue(low)} - {formatValue(high)}
        </div>
      </div>

      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute w-full h-1 bg-gray-200 rounded-full top-1/2 transform -translate-y-1/2"></div>

        {/* Active area */}
        <div
          className="absolute h-1 bg-blue-500 top-1/2 transform -translate-y-1/2 rounded-full"
          style={{
            left: `${lowPercent}%`,
            right: `${100 - highPercent}%`,
          }}
        ></div>

        {/* Input range for low value */}
        <input
          type="range"
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLowChange}
        />

        {/* Input range for high value */}
        <input
          type="range"
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHighChange}
        />

        {/* Low thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${lowPercent}%` }}
        ></div>

        {/* High thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${highPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
