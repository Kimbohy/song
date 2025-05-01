import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  nameKey?: string;
  dataKey?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
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
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
};

const COLOR_ARRAY = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
  "#059669",
  "#6366f1",
  "#06b6d4",
  "#ec4899",
  "#d97706",
];

export const PieChart = ({
  data,
  nameKey = "name",
  dataKey = "value",
  colors = [
    "blue",
    "green",
    "red",
    "purple",
    "amber",
    "emerald",
    "indigo",
    "cyan",
  ],
  innerRadius = 0,
  outerRadius = 80,
  formatValue,
  onClick,
}: PieChartProps) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const getColorHex = (index: number) => {
    if (colors[index % colors.length] in COLORS) {
      return COLORS[colors[index % colors.length] as keyof typeof COLORS];
    }
    return COLOR_ARRAY[index % COLOR_ARRAY.length];
  };

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    if (onClick) {
      onClick(data);
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = formatValue
        ? formatValue(payload[0].value)
        : payload[0].value;

      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-100">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{`Value: ${value}`}</p>
          <p className="text-sm text-gray-600">{`Percentage: ${(
            payload[0].percent * 100
          ).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Extract colors as hex values
  const colorHexArray = data.map((_, index) => getColorHex(index));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            nameKey={nameKey}
            dataKey={dataKey}
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorHexArray[index % colorHexArray.length]}
                stroke={index === activeIndex ? "#fff" : "transparent"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry, index) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
