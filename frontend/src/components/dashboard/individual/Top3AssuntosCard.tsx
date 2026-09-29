import { AssuntoRevisaoType } from "@/interfaces/dashboard";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<string, string> = {
  ALTA: "bg-destructive/10 text-destructive border-destructive",
  MEDIA: "bg-chart-5/10 text-chart-5 border-chart-5",
  BAIXA: "bg-chart-2/10 text-chart-2 border-chart-2",
};

const PRIORITY_LABELS: Record<string, string> = {
  ALTA: "Prioridade Alta",
  MEDIA: "Prioridade Média",
  BAIXA: "Prioridade Baixa",
};

type Top3AssuntosCardProps = {
  data: AssuntoRevisaoType[];
};

export function Top3AssuntosCard({ data }: Top3AssuntosCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Top 3 Assuntos para Revisar</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border border-border p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">{item.assunto}</span>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full border shrink-0",
                  PRIORITY_STYLES[item.prioridade] ?? ""
                )}
              >
                {PRIORITY_LABELS[item.prioridade] ?? item.prioridade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
