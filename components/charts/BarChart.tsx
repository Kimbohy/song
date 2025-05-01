import { useCallback, useState } from "react";
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
import { formatNumber } from "@/lib/utils";

// Color mapping for consistent styling
const COLORS = {
  blue: "#2563eb",
  green: "#10b981",
  red: "#ef4444",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  emerald: "#059669",
  indigo: "#6366f1",
  cyan: "#06b6d4",
};

interface Props {
  data: any[];
  xKey: string;
  yKey: string;
  color?: keyof typeof COLORS;
  horizontal?: boolean;
  showGrid?: boolean;
  formatValue?: (value: number) => string;
  onClick?: (data: any) => void;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = "blue",
  horizontal = false,
  showGrid = true,
  formatValue = formatNumber,
  onClick,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const colorHex = COLORS[color] || COLORS.blue;
  const isClickable = !!onClick;

  const handleClick = useCallback(
    (_dataPoint: any, index: number): void => {
      if (onClick && data[index]) onClick(data[index]);
    },
    [onClick, data]
  );

  const onMouseOver = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onMouseLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  return (
    <div className={`w-full h-[300px] ${isClickable ? "cursor-pointer" : ""}`}>
      {isClickable && (
        <div className="flex items-center mb-2 text-xs text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-1.5"></span>
          Click on bars for details
        </div>
      )}
      <ResponsiveContainer>
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          onClick={isClickable ? handleClick : undefined}
          margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.4} />}

          <XAxis
            type={horizontal ? "number" : "category"}
            dataKey={horizontal ? undefined : xKey}
            tickFormatter={horizontal ? formatValue : undefined}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#cbd5e1" }}
          />

          <YAxis
            type={horizontal ? "category" : "number"}
            dataKey={horizontal ? xKey : undefined}
            tickFormatter={horizontal ? undefined : formatValue}
            width={65}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#cbd5e1" }}
          />

          <Tooltip
            formatter={formatValue}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              border: "none",
              padding: "8px 12px",
            }}
            cursor={{ fill: "rgba(245, 245, 245, 0.6)" }}
          />

          <Bar
            dataKey={yKey}
            radius={[4, 4, 0, 0]}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorHex}
                fillOpacity={activeIndex === index ? 1 : 0.8}
                className={`transition-all duration-200 ${
                  isClickable ? "hover:brightness-110" : ""
                }`}
                stroke={
                  activeIndex === index
                    ? isClickable
                      ? "#1e40af"
                      : "none"
                    : "none"
                }
                strokeWidth={activeIndex === index && isClickable ? 1 : 0}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
