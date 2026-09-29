import { StatCard } from "../StatCard";
import { IndividualDashboardType } from "@/interfaces/dashboard";

type IndividualKpiCardsProps = {
  data: IndividualDashboardType;
};

export function IndividualKpiCards({ data }: IndividualKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
      <StatCard
        label="Média Geral de Acertos"
        value={`${data.mediaGeralAcertos.acertos} de ${data.mediaGeralAcertos.total}`}
      />
      <StatCard
        label="Pontuação Máxima"
        value={`${data.pontuacaoMaxima.acertos} de ${data.pontuacaoMaxima.total}`}
        subtitle={data.pontuacaoMaxima.simuladoNome}
      />
      <StatCard
        label="Pontuação Mínima"
        value={`${data.pontuacaoMinima.acertos} de ${data.pontuacaoMinima.total}`}
        subtitle={data.pontuacaoMinima.simuladoNome}
      />
      <StatCard
        label="Índice de Coerência"
        value={`${(data.indiceCoerenciaMedio * 100).toFixed(0)}%`}
      />
    </div>
  );
}
