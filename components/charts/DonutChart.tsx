import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { MousePointer } from "lucide-react";

// Palette de couleurs pour les graphiques
const COLORS = {
  chart1: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
  chart2: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"],
  chart3: ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"],
  chart4: ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"],
  chart5: ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"],
};

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colorScheme?: keyof typeof COLORS;
  formatValue?: (value: number) => string;
  onClick?: (data: any) => void;
  showLegend?: boolean;
}

export function DonutChart({
  data,
  colorScheme = "chart1",
  formatValue = formatNumber,
  onClick,
  showLegend = true,
}: DonutChartProps) {
  const colors = COLORS[colorScheme];
  const isClickable = !!onClick;

  const handleClick = (entry: any) => {
    if (onClick && entry && entry.payload) {
      onClick(entry.payload);
    }
  };

  return (
    <div
      className={`w-full h-[300px] relative group ${
        isClickable ? "cursor-pointer" : ""
      }`}
      role={isClickable ? "button" : "figure"}
      aria-label={isClickable ? "Interactive chart" : "Chart"}
    >
      {/* {isClickable && (
        <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
          <MousePointer className="w-3 h-3" />
          <span>Click segments for details</span>
        </div>
      )} */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                fillOpacity={0.8}
                style={{
                  filter: isClickable ? "brightness(1)" : undefined,
                  transition: "all 0.2s ease-in-out",
                }}
                className={`${
                  isClickable
                    ? "hover:brightness-110 hover:filter hover:drop-shadow-lg"
                    : ""
                }`}
              />
            ))}
          </Pie>
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                fontSize: "11px",
                color: "#64748b",
                fontWeight: "bold",
                cursor: isClickable ? "pointer" : "default",
              }}
              onClick={handleClick}
            />
          )}
          <Tooltip
            formatter={(value: number) => [formatValue(value), "Value"]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              border: "none",
              padding: "8px 12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* {isClickable && (
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-lg" />
      )} */}
    </div>
  );
}
