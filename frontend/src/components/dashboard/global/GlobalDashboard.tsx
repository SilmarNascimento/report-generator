import { useGlobalDashboard } from "@/hooks/CRUD/dashboard/useGlobalDashboard";
import { GlobalKpiCards } from "./GlobalKpiCards";
import { Top5AssuntosCard } from "./Top5AssuntosCard";
import { DificuldadeDonutChart } from "./DificuldadeDonutChart";
import { MediaAssuntoChart } from "./MediaAssuntoChart";
import { DesempenhoSimuladoChart } from "../DesempenhoSimuladoChart";
import { DesempenhoAreaChart } from "../DesempenhoAreaChart";
import { PadroesPlaceholder } from "../PadroesPlaceholder";

type GlobalDashboardProps = {
  year: string;
  mockExamIds: string[];
};

export function GlobalDashboard({ year, mockExamIds }: GlobalDashboardProps) {
  const { data, isLoading, isError } = useGlobalDashboard(year, mockExamIds);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Carregando dados...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Nenhum dado encontrado para os filtros selecionados.
      </div>
    );
  }

  const simuladoChartData = data.desempenhoAcumuladoPorSimulado.map((s) => ({
    label: s.simuladoNome,
    value: s.mediaAcertos,
  }));

  return (
    <div className="flex flex-col gap-6">
      <GlobalKpiCards data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Desempenho Acumulado por Simulado
          </h3>
          <DesempenhoSimuladoChart
            data={simuladoChartData}
            valueLabel="Média de acertos"
          />
        </div>
        <Top5AssuntosCard data={data.top5AssuntosComMaisErros} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Desempenho por Área</h3>
          <DesempenhoAreaChart data={data.desempenhoAreaMate} />
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Acertos por Dificuldade</h3>
          <DificuldadeDonutChart data={data.desempenhoPorDificuldade} />
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Média por Assunto</h3>
          <MediaAssuntoChart data={data.desempenhoPorAssunto} />
        </div>
      </div>

      <PadroesPlaceholder />
    </div>
  );
}
