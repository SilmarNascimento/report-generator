import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DificuldadeDesempenhoType } from "@/interfaces/dashboard";

const LEVEL_COLORS: Record<string, string> = {
  "FÁCIL": "var(--color-chart-2)",
  "MÉDIO": "var(--color-chart-5)",
  "DIFÍCIL": "var(--color-chart-3)",
};

const LEVEL_ORDER = ["FÁCIL", "MÉDIO", "DIFÍCIL"];

type DificuldadeDonutChartProps = {
  data: DificuldadeDesempenhoType[];
};

export function DificuldadeDonutChart({ data }: DificuldadeDonutChartProps) {
  const sorted = [...data].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.nivel) - LEVEL_ORDER.indexOf(b.nivel)
  );
  const chartData = sorted.map((d) => ({ name: d.nivel, value: Math.round(d.media) }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={LEVEL_COLORS[entry.name] ?? "var(--color-chart-4)"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            fontSize: 12,
          }}
          formatter={(value) => [`${Number(value)}%`, "Média de acertos"]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
