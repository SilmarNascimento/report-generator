import { useState } from "react";
import { useIndividualDashboard } from "@/hooks/CRUD/dashboard/useIndividualDashboard";
import { StudentSelector } from "./StudentSelector";
import { IndividualKpiCards } from "./IndividualKpiCards";
import { Top3AssuntosCard } from "./Top3AssuntosCard";
import { DesempenhoAssuntoChart } from "./DesempenhoAssuntoChart";
import { DificuldadeChart } from "./DificuldadeChart";
import { DesempenhoSimuladoChart } from "../DesempenhoSimuladoChart";
import { DesempenhoAreaChart } from "../DesempenhoAreaChart";
import { PadroesPlaceholder } from "../PadroesPlaceholder";

type IndividualDashboardProps = {
  year: string;
  mockExamIds: string[];
};

export function IndividualDashboard({ year, mockExamIds }: IndividualDashboardProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const { data, isLoading, isError } = useIndividualDashboard(
    selectedStudentId,
    year,
    mockExamIds
  );

  const simuladoChartData =
    data?.desempenhoAcumuladoPorSimulado.map((s) => ({
      label: s.simuladoNome,
      value: s.acertos,
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <StudentSelector
        selectedStudentId={selectedStudentId}
        onStudentChange={(id) => setSelectedStudentId(id)}
      />

      {!selectedStudentId && (
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <span className="text-base font-medium text-muted-foreground">
            Nenhum aluno selecionado
          </span>
          <span className="text-sm text-muted-foreground">
            Selecione um aluno para visualizar os dados do Dashboard Individual.
          </span>
        </div>
      )}

      {selectedStudentId && isLoading && (
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Carregando dados...
        </div>
      )}

      {selectedStudentId && isError && (
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Nenhum dado encontrado para os filtros selecionados.
        </div>
      )}

      {selectedStudentId && data && (
        <>
          <IndividualKpiCards data={data} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Desempenho Acumulado por Simulado
              </h3>
              <DesempenhoSimuladoChart data={simuladoChartData} valueLabel="Acertos" />
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Desempenho Acumulado por Área
              </h3>
              <DesempenhoAreaChart data={data.desempenhoAreaMate} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Desempenho Médio por Assunto
              </h3>
              <DesempenhoAssuntoChart data={data.desempenhoPorAssunto} />
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Desempenho por Dificuldade
              </h3>
              <DificuldadeChart data={data.desempenhoPorDificuldade} />
            </div>
          </div>

          <Top3AssuntosCard data={data.top3AssuntosParaRevisar} />

          <PadroesPlaceholder />
        </>
      )}
    </div>
  );
}
