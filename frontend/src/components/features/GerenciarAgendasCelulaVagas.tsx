import { statusCellClasses } from "@/constants/agenda";
import { InformacaoHorarioType } from "../forms/gerenciar-agenda/formularioGerenciarAgendaSchema";
import clsx from "clsx";

type GerenciarAgendasCelulaVagasProps = {
  informacaoHorario: InformacaoHorarioType;
  isSelected: boolean;
};

function GerenciarAgendasCelulaVagas({
  informacaoHorario,
  isSelected,
}: GerenciarAgendasCelulaVagasProps) {
  const { vagasDisponiveis, vagasMarcadas, vagasTotal, statusBloqueioHorario } =
    informacaoHorario;

  const horarioSemVagas = vagasDisponiveis === 0;

  return (
    <div
      className={clsx(
        "m-auto flex h-7 w-20 flex-row items-center justify-between rounded-sm p-1",
        statusCellClasses[statusBloqueioHorario].cell,
        {
          "bg-[#99C6FF]": isSelected,
          "text-[#494C57] opacity-50":
            horarioSemVagas && statusBloqueioHorario === "DISPONIVEL",
        },
      )}
    >
      <div>
        <span className="text-xs leading-6 font-normal">{vagasMarcadas}</span>
        <span>/</span>
        <span className="text-xs leading-6 font-normal">{vagasTotal}</span>
      </div>
      <div
        className={clsx(
          "flex h-5 w-6 items-center justify-center rounded-full p-0.25",
          statusCellClasses[statusBloqueioHorario].badge,
          {
            "border-1 border-[#E7E9EB] bg-transparent text-[#494C57]":
              horarioSemVagas && statusBloqueioHorario === "DISPONIVEL",
          },
        )}
      >
        <span className="text-xs leading-6 font-medium">
          {vagasDisponiveis}
        </span>
      </div>
    </div>
  );
}

export default GerenciarAgendasCelulaVagas;
