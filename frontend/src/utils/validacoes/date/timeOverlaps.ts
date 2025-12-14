import { PeriodoComIndex } from "@/types/general";
import { isAfter, isBefore } from "date-fns";

export function verificaSobreposicaoHorarios(
  inicioA: Date,
  fimA: Date,
  inicioB: Date,
  fimB: Date,
): boolean {
  const aComecaAntesDeBTerminar = isBefore(inicioA, fimB);

  const aTerminaDepoisDeBComecar = isAfter(fimA, inicioB);

  return aComecaAntesDeBTerminar && aTerminaDepoisDeBComecar;
}

export function encontrarConflitosHorarios(
  periodosComIndex: PeriodoComIndex[],
): Array<{ indexA: number; indexB: number }> {
  const conflitos: Array<{ indexA: number; indexB: number }> = [];

  for (let i = 0; i < periodosComIndex.length; i++) {
    const periodoA = periodosComIndex[i];

    for (let j = i + 1; j < periodosComIndex.length; j++) {
      const periodoB = periodosComIndex[j];

      const temSobreposicao = verificaSobreposicaoHorarios(
        periodoA.inicio,
        periodoA.fim,
        periodoB.inicio,
        periodoB.fim,
      );

      if (temSobreposicao) {
        conflitos.push({
          indexA: periodoA.index,
          indexB: periodoB.index,
        });
      }
    }
  }

  return conflitos;
}
