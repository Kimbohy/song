import React from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  keys: string[];
  indexBy: string;
  height?: number;
  colors?: string[];
  fillOpacity?: number;
  valueFormat?: (value: number) => string;
  showGrid?: boolean;
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
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
};

const DEFAULT_COLORS = ["blue", "green", "red", "purple", "amber"];

export const RadarChart = ({
  data,
  keys,
  indexBy,
  height = 400,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.2,
  valueFormat,
  showGrid = true,
}: RadarChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-100">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => {
            const value = valueFormat ? valueFormat(entry.value) : entry.value;
            const colorName = colors[index % colors.length];
            const color =
              COLORS[colorName as keyof typeof COLORS] || COLORS.blue;

            return (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <p className="text-sm text-gray-600">
                  {`${entry.name}: ${value}`}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          {showGrid && <PolarGrid stroke="#e5e7eb" />}
          <PolarAngleAxis
            dataKey={indexBy}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <PolarRadiusAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            angle={30}
            tickFormatter={valueFormat}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {data.map((entry, index) => {
            const colorName = colors[index % colors.length];
            const color =
              COLORS[colorName as keyof typeof COLORS] || COLORS.blue;

            return (
              <Radar
                key={entry.name}
                name={entry.name}
                dataKey={entry.name}
                stroke={color}
                fill={color}
                fillOpacity={fillOpacity}
              />
            );
          })}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
