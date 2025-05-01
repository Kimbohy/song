import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  horizontal?: boolean;
  showGrid?: boolean;
  formatValue?: (value: number) => string;
  onClick?: (data: any) => void;
}

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  emerald: "#059669",
  indigo: "#6366f1",
  cyan: "#06b6d4",
};

export const BarChart = ({
  data,
  xKey,
  yKey,
  color = "blue",
  horizontal = false,
  showGrid = true,
  formatValue,
  onClick,
}: BarChartProps) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const colorHex = COLORS[color as keyof typeof COLORS] || COLORS.blue;

  const handleClick = (data: any) => {
    if (onClick) {
      onClick(data);
    }
  };

  const onMouseOver = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onMouseLeave = () => {
    setActiveIndex(-1);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = formatValue
        ? formatValue(payload[0].value)
        : payload[0].value;

      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">{`${yKey}: ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          onClick={handleClick}
          margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          {horizontal ? (
            <>
              <XAxis type="number" tickFormatter={formatValue} />
              <YAxis
                dataKey={xKey}
                type="category"
                width={120}
                tick={{ fontSize: 12 }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis tickFormatter={formatValue} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={yKey}
            fill={colorHex}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#1d4ed8" : colorHex}
                cursor="pointer"
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
