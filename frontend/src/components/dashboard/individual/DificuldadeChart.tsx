import { DificuldadeDesempenhoType } from "@/interfaces/dashboard";
import { cn } from "@/lib/utils";

const LEVEL_CONFIG: Record<string, { color: string; dot: string }> = {
  "FÁCIL": { color: "bg-chart-2", dot: "bg-chart-2" },
  "MÉDIO": { color: "bg-chart-5", dot: "bg-chart-5" },
  "DIFÍCIL": { color: "bg-destructive", dot: "bg-destructive" },
};

const LEVEL_ORDER = ["FÁCIL", "MÉDIO", "DIFÍCIL"];

type DificuldadeChartProps = {
  data: DificuldadeDesempenhoType[];
};

export function DificuldadeChart({ data }: DificuldadeChartProps) {
  const sorted = [...data].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.nivel) - LEVEL_ORDER.indexOf(b.nivel)
  );

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((item) => {
        const pct = Math.min(100, Math.max(0, Math.round(item.media)));
        const config = LEVEL_CONFIG[item.nivel] ?? { color: "bg-primary", dot: "bg-primary" };

        return (
          <div key={item.nivel} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", config.dot)} />
                <span className="text-foreground">{item.nivel}</span>
              </div>
              <span className="font-semibold text-foreground">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", config.color)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
