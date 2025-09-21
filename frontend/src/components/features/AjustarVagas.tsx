import { useFieldArray, useFormContext } from "react-hook-form";
import { FormularioGerenciarAgendaType } from "../forms/gerenciar-agenda/formularioGerenciarAgendaSchema";

type AjustarVagasProps = {
  idsSelecionados: number[];
};

export default function AjustarVagas({ idsSelecionados }: AjustarVagasProps) {
  const { control, getValues } =
    useFormContext<FormularioGerenciarAgendaType>();
  const { update } = useFieldArray({
    control,
    name: "horarioVagas",
  });

  const handleAdjust = (delta: number) => {
    const horarios = getValues("horarioVagas");

    idsSelecionados.forEach((idHorarioVaga) => {
      const index = horarios.findIndex(
        (h) => h.idHorarioVaga === idHorarioVaga,
      );
      if (index === -1) return;

      const horarioCelula = horarios[index];
      const newVagasTotal = Math.max(
        horarioCelula.vagasMarcadas,
        horarioCelula.vagasTotal + delta,
      );
      const newVagasDisponiveis = Math.max(
        0,
        horarioCelula.vagasDisponiveis + delta,
      );

      update(index, {
        ...horarioCelula,
        vagasTotal: newVagasTotal,
        vagasDisponiveis: newVagasDisponiveis,
      });
    });
  };

  return (
    <section className="flex flex-col gap-1.75">
      <div>
        <span
          className={`text-sm leading-5 font-medium text-[#000000] ${
            !idsSelecionados.length ? "opacity-50" : ""
          }`}
        >
          Ajustar vagas
        </span>
      </div>

      <div className="flex h-10 flex-row overflow-hidden rounded-lg">
        <button
          type="button"
          disabled={!idsSelecionados.length}
          onClick={() => handleAdjust(-1)}
          className="group flex items-center justify-center rounded-l-lg border border-r-0 border-[#0034B7] bg-white px-4 py-2 transition-colors hover:bg-[#0034B7] disabled:opacity-50"
        >
          <span
            className="material-symbols-outlined text-[#0034B7] transition-colors group-hover:text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            do_not_disturb_on
          </span>
        </button>

        <button
          type="button"
          disabled={!idsSelecionados.length}
          onClick={() => handleAdjust(1)}
          className="group flex items-center justify-center rounded-r-lg border border-[#0034B7] bg-white px-4 py-2 transition-colors hover:bg-[#0034B7] disabled:opacity-50"
        >
          <span
            className="material-symbols-outlined text-[#0034B7] transition-colors group-hover:text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add_circle
          </span>
        </button>
      </div>
    </section>
  );
}
