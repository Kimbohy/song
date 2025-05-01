import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AreaChartProps {
  data: any[];
  xKey: string;
  yKeys: string[];
  colors?: string[];
  showGrid?: boolean;
  formatValue?: (value: number) => string;
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

export const AreaChart = ({
  data,
  xKey,
  yKeys,
  colors = ["blue", "green", "red", "purple", "amber"],
  showGrid = true,
  formatValue,
}: AreaChartProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-100">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => {
            const value = formatValue ? formatValue(entry.value) : entry.value;

            return (
              <p
                key={`value-${index}`}
                className="text-sm"
                style={{ color: entry.color }}
              >
                {`${entry.name}: ${value}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatValue} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {yKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stackId={index === 0 ? "1" : `${index}`}
              fill={
                COLORS[colors[index % colors.length] as keyof typeof COLORS] ||
                COLORS.blue
              }
              stroke={
                COLORS[colors[index % colors.length] as keyof typeof COLORS] ||
                COLORS.blue
              }
              fillOpacity={0.6}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
