import React, { useState, useMemo } from "react";
import { useGetVisualizarAgendamentos } from "@/hooks/crud/gerenciar-agenda/useVisualizarAgendamentos";
import { useHandleCancelarAgendamentos } from "@/hooks/crud/gerenciar-agenda/useHandleCancelarAgendamentos";
import { successAlert } from "@/util/toastAlerts";
import Sidepanel from "./Sidepanel";
import { Checkbox } from "../ui/shadcn/checkbox";
import Botao from "../shared/Botao";
import { useFormContext } from "react-hook-form";
import { FormularioGerenciarAgendaType } from "../forms/gerenciar-agenda/formularioGerenciarAgendaSchema";

interface AgendamentosSidepanelProps {
  mode: "visualizar" | "cancelar";
  selectedIds: number[];
  isOpen: boolean;
  onClose: VoidFunction;
}

const AgendamentosSidepanel: React.FC<AgendamentosSidepanelProps> = ({
  mode,
  selectedIds,
  onClose,
  isOpen,
}) => {
  const [selectedAgendamentos, setSelectedAgendamentos] = useState<Set<number>>(
    new Set(),
  );

  const {
    data: agendamentos,
    isLoading,
    error,
  } = useGetVisualizarAgendamentos(selectedIds);

  const { reset, getValues } = useFormContext<FormularioGerenciarAgendaType>();
  const agendaId = getValues("agenda.agendaId").toString();

  const { mutate: cancelarAgendamentos } = useHandleCancelarAgendamentos(
    agendaId,
    reset,
  );

  const handleCancelarSelecionados = () => {
    cancelarAgendamentos(Array.from(selectedAgendamentos), {
      onSuccess: () => {
        successAlert("Agendamentos cancelados com sucesso!");
        onClose();
      },
    });
  };

  const isAllSelected = useMemo(() => {
    return (
      agendamentos &&
      agendamentos.length > 0 &&
      selectedAgendamentos.size === agendamentos?.length
    );
  }, [agendamentos, selectedAgendamentos]);

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedAgendamentos(new Set());
    } else {
      setSelectedAgendamentos(
        new Set(agendamentos?.map((agendamento) => agendamento.id)),
      );
    }
  };

  const handleCheckboxChange = (idAgendamento: number) => {
    setSelectedAgendamentos((prev) => {
      const newSelection = new Set(prev);

      if (newSelection.has(idAgendamento)) {
        newSelection.delete(idAgendamento);
      } else {
        newSelection.add(idAgendamento);
      }

      return newSelection;
    });
  };

  const getTitle = () => {
    if (mode === "visualizar") {
      return "Visualizar agendamentos";
    } else {
      return "Cancelar agendamentos";
    }
  };

  if (isLoading) {
    return <div>Carregando agendamentos...</div>;
  }

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  return (
    <Sidepanel isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {mode === "cancelar" ? (
        <section className="flex justify-end border-b-1 border-[#CED2D7] px-4 pb-4">
          <div className="flex gap-5">
            <span className="my-auto text-left text-xs leading-4.5 font-normal text-[#494C57]">
              {selectedAgendamentos.size} agendamentos selecionados
            </span>
            <Botao
              perfil="cancelar"
              type="button"
              className="text-[#0034B7]"
              onClick={onClose}
            />
            <Botao
              perfil="excluir2"
              type="button"
              onClick={handleCancelarSelecionados}
              disabled={selectedAgendamentos.size === 0}
              label="Cancelar Selecionados"
            />
          </div>
        </section>
      ) : (
        <div className="border-b-1 border-[#CED2D7]" />
      )}
      <section className="p-6">
        {agendamentos && agendamentos.length > 0 && (
          <table className="w-full min-w-188 table-auto">
            <colgroup>
              {mode === "cancelar" && <col className="w-10" />}
              <col className="w-30" />
              <col className={`${mode === "cancelar" ? "w-79.5" : "w-89.5"}`} />
              <col className="w-37.5" />
              <col className="w-31" />
            </colgroup>

            <thead className="bg-[#0034B7] text-[#F8FAFC]">
              <tr className="h-10 text-[0.625rem] leading-4 font-normal">
                {mode === "cancelar" && (
                  <th className="px-3 py-3 text-left">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAllChange}
                    />
                  </th>
                )}
                <th className="px-3 py-3 text-left">Horário</th>
                <th className="px-3 py-3 text-left">Nome</th>
                <th className="px-3 py-3 text-left">Telefone</th>
                <th className="px-3 py-3 text-left">Serviço</th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.map((agendamento) => (
                <tr
                  key={agendamento.id}
                  className="h-10 bg-white text-[0.625rem] leading-4 font-normal"
                >
                  {mode === "cancelar" && (
                    <td className="border px-4 py-2">
                      <Checkbox
                        value={agendamento.id}
                        checked={selectedAgendamentos.has(agendamento.id)}
                        onCheckedChange={() =>
                          handleCheckboxChange(agendamento.id)
                        }
                      />
                    </td>
                  )}
                  <td className="border px-3 py-3">{agendamento.horario}</td>
                  <td className="border px-3 py-3 uppercase">
                    {agendamento.nome}
                  </td>
                  <td className="border px-3 py-3">{agendamento.telefone}</td>
                  <td className="border px-3 py-3">
                    {agendamento.sigla_servico}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </Sidepanel>
  );
};

export default AgendamentosSidepanel;
