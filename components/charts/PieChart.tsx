import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface PieChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
  onClick?: (data: any) => void;
}

const DEFAULT_COLORS = ["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

export function PieChart({
  data,
  nameKey,
  dataKey,
  colors = DEFAULT_COLORS,
  onClick,
}: PieChartProps) {
  const isClickable = !!onClick;

  return (
    <div className={`w-full h-[300px] ${isClickable ? "cursor-pointer" : ""}`}>
      {isClickable && (
        <div className="flex items-center mb-2 text-xs text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-1.5"></span>
          Click on sections for details
        </div>
      )}
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${formatNumber(value)}`}
            labelLine={true}
            onClick={onClick ? (entry) => onClick(entry.payload) : undefined}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              border: "none",
              padding: "8px 12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
