import { useFormContext, useWatch } from "react-hook-form";
import { FormularioGerenciarAgendaType } from "../forms/gerenciar-agenda/formularioGerenciarAgendaSchema";
import { BLOQUEIO_STATUS } from "@/constants/agenda";
import ModalFlutuante from "./ModalFlutuante";
import FormularioBloquearHorario from "../forms/gerenciar-agenda/bloquear-horario/FormularioBloquearHorario";
import { useState } from "react";
import { FormularioBloqueioHorarioType } from "../forms/gerenciar-agenda/bloquear-horario/formularioBloquearHorarioSchema";
import { useIsPristine } from "@/hooks/useIsPrestine";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

type BloquearHorariosType = {
  idsSelecionados: number[];
};

function BloquearHorarios({ idsSelecionados }: BloquearHorariosType) {
  const [isBloquearHorarioOpen, setIsBloquearHorarioOpen] = useState(false);
  const [isDesbloquearHorarioOpen, setIsDesbloquearHorarioOpen] =
    useState(false);
  const isPristine = useIsPristine<FormularioGerenciarAgendaType>();

  const { control } = useFormContext<FormularioGerenciarAgendaType>();
  const horarioVagas = useWatch({
    control,
    name: "horarioVagas",
  });

  const handleBloquearHorario = (dados: FormularioBloqueioHorarioType) => {
    console.log(dados);
  };

  const horarioVagasSelecionados = horarioVagas.filter((horarioVaga) =>
    idsSelecionados.includes(horarioVaga.idHorarioVaga),
  );
  const agendamentosMarcados = horarioVagasSelecionados.reduce(
    (acc, cur) => acc + cur.vagasMarcadas,
    0,
  );

  const podeBloquear = horarioVagasSelecionados.some(
    (vaga) =>
      vaga.statusBloqueioHorario === BLOQUEIO_STATUS.DISPONIVEL ||
      vaga.statusBloqueioHorario === BLOQUEIO_STATUS.PARCIAL,
  );

  const podeDesbloquear = horarioVagasSelecionados.some(
    (vaga) =>
      vaga.statusBloqueioHorario === BLOQUEIO_STATUS.TOTAL ||
      vaga.statusBloqueioHorario === BLOQUEIO_STATUS.PARCIAL,
  );

  const desabilitarTudo = !idsSelecionados.length || !isPristine;

  const renderBotao = (
    icone: string,
    onClick: () => void,
    disabled: boolean,
    isLeft?: boolean,
  ) => {
    const botao = (
      <button
        type="button"
        disabled={disabled || desabilitarTudo}
        onClick={onClick}
        className={cn(
          "group flex items-center justify-center border border-[#0034B7] bg-white px-4 py-2 transition-colors hover:bg-[#0034B7] disabled:opacity-50",
          isLeft ? "rounded-l-lg border-r-0" : "rounded-r-lg",
        )}
      >
        <span
          className="material-symbols-outlined text-[#0034B7] transition-colors group-hover:text-white"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icone}
        </span>
      </button>
    );

    if (!isPristine) {
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>{botao}</TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-lg p-2 text-xs whitespace-pre-line"
              sideOffset={4}
            >
              {
                "Salve ou cancele as alterações para\nhabilitar o bloqueio de horários."
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return botao;
  };

  return (
    <section className="flex flex-col gap-1.75">
      <div>
        <span
          className={cn("text-sm leading-5 font-medium text-[#000000]", {
            "opacity-50": !idsSelecionados.length || !isPristine,
          })}
        >
          Bloquear horários
        </span>
      </div>

      <section className="flex h-10 flex-row overflow-hidden rounded-lg">
        {renderBotao(
          "lock_open",
          () => setIsDesbloquearHorarioOpen(true),
          !podeDesbloquear,
          true,
        )}
        {renderBotao(
          "lock",
          () => setIsBloquearHorarioOpen(true),
          !podeBloquear,
        )}
      </section>

      <ModalFlutuante
        isOpen={isBloquearHorarioOpen}
        onClose={() => setIsBloquearHorarioOpen(false)}
        title="Abrir novo horário"
      >
        <FormularioBloquearHorario
          agendamentosMarcados={agendamentosMarcados}
          idsSelecionados={idsSelecionados}
          onCancel={() => setIsBloquearHorarioOpen(false)}
          handleSubmitRequest={(dados: FormularioBloqueioHorarioType) => {
            handleBloquearHorario(dados);
            setIsBloquearHorarioOpen(false);
          }}
        />
      </ModalFlutuante>

      <ModalFlutuante
        isOpen={isDesbloquearHorarioOpen}
        onClose={() => setIsDesbloquearHorarioOpen(false)}
        title="Abrir novo horário"
      >
        <FormularioBloquearHorario
          agendamentosMarcados={agendamentosMarcados}
          idsSelecionados={idsSelecionados}
          onCancel={() => setIsBloquearHorarioOpen(false)}
          handleSubmitRequest={(dados: FormularioBloqueioHorarioType) => {
            handleBloquearHorario(dados);
            setIsDesbloquearHorarioOpen(false);
          }}
        />
      </ModalFlutuante>
    </section>
  );
}

export default BloquearHorarios;
