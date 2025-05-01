// filepath: /home/kim/code/sql/song/song/components/charts/RadarChart.tsx
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

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

interface RadarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  color?: keyof typeof COLORS;
  fullMark?: number;
}

export function RadarChart({
  data,
  color = "indigo",
  fullMark = 1,
}: RadarChartProps) {
  const colorHex = COLORS[color] || COLORS.indigo;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, fullMark]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Radar
            name="Audio Features"
            dataKey="value"
            stroke={colorHex}
            fill={colorHex}
            fillOpacity={0.6}
          />
          <Tooltip
            formatter={(value: number) => [
              (value * 10).toFixed(1) + "/10",
              "Score",
            ]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              border: "none",
              padding: "8px 12px",
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
