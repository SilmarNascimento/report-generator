import { AssuntoDesempenhoType } from "@/interfaces/dashboard";
import { cn } from "@/lib/utils";

type DesempenhoAssuntoChartProps = {
  data: AssuntoDesempenhoType[];
};

export function DesempenhoAssuntoChart({ data }: DesempenhoAssuntoChartProps) {
  const top10 = data.slice(0, 10);

  return (
    <div className="flex flex-col gap-3">
      {top10.map((item) => {
        const pct = Math.min(100, Math.max(0, Math.round(item.media)));
        const isLow = pct < 50;

        return (
          <div key={item.assunto} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground truncate max-w-[70%]">{item.assunto}</span>
              <span className={cn("font-semibold", isLow ? "text-destructive" : "text-foreground")}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", isLow ? "bg-destructive" : "bg-primary")}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
