import { useCallback, useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  const handleClick = useCallback(
    (data: any) => {
      if (onClick) onClick(data);
    },
    [onClick]
  );

  const onMouseOver = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onMouseLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          onClick={handleClick}
          margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}

          <XAxis
            type={horizontal ? "number" : "category"}
            dataKey={horizontal ? undefined : xKey}
            tickFormatter={horizontal ? formatValue : undefined}
            angle={-45}
            textAnchor="end"
            height={60}
          />

          <YAxis
            type={horizontal ? "category" : "number"}
            dataKey={horizontal ? xKey : undefined}
            tickFormatter={horizontal ? undefined : formatValue}
            width={65}
          />

          <Tooltip
            formatter={formatValue}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              border: "none",
            }}
          />

          <Bar
            dataKey={yKey}
            fill={colorHex}
            radius={[4, 4, 0, 0]}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            opacity={0.9}
          >
            {data.map((_, index) => (
              <rect
                key={`bar-${index}`}
                fillOpacity={activeIndex === index ? 1 : 0.9}
                className="transition-all duration-200"
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
