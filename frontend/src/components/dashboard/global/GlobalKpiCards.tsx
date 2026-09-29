import { StatCard } from "../StatCard";
import { GlobalDashboardType } from "@/interfaces/dashboard";

type GlobalKpiCardsProps = {
  data: GlobalDashboardType;
};

export function GlobalKpiCards({ data }: GlobalKpiCardsProps) {
  const totalRespostas = data.participacaoPorSimulado.reduce(
    (sum, s) => sum + s.quantidade,
    0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      <StatCard
        label="Média Geral de Acertos"
        value={`${data.mediaGeralAcertos.toFixed(1)}%`}
      />
      <StatCard
        label="Pontuação Máxima"
        value={data.pontuacaoMaxima.toFixed(2)}
      />
      <StatCard
        label="Pontuação Mínima"
        value={data.pontuacaoMinima.toFixed(2)}
      />
      <StatCard
        label="Índice de Coerência"
        value={data.indiceCoerenciaMedio.toFixed(2)}
      />
      <StatCard
        label="Participação"
        value={totalRespostas}
        subtitle="total de respostas"
      />
    </div>
  );
}
