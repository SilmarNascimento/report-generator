import { Top5AssuntoType } from "@/interfaces/dashboard";

type Top5AssuntosCardProps = {
  data: Top5AssuntoType[];
};

export function Top5AssuntosCard({ data }: Top5AssuntosCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Top 5 Assuntos com Mais Erros</h3>
      <ol className="flex flex-col gap-2">
        {data.map((item) => (
          <li key={item.rank} className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold text-muted-foreground shrink-0">
              {item.rank}
            </span>
            <span className="flex-1 text-sm text-foreground truncate">{item.assunto}</span>
            <span className="text-sm font-semibold text-destructive">
              {item.taxaErro.toFixed(0)}% erro
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
