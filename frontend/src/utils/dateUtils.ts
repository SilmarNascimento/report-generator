import { format } from "date-fns";

export const formatarData = (dataString: string): string => {
  const data = new Date(dataString + "T00:00:00");
  return new Intl.DateTimeFormat("pt-BR").format(data);
};

export const formatarPeriodoDataComDiaSemana = (data: string) => {
  const dia = new Date(data + "T00:00:00");
  let diaSemana = dia.toLocaleDateString("pt-BR", { weekday: "short" });
  diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  const diaMes = dia.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${diaSemana}, ${diaMes}`;
};

export const formatarPeriodoData = (from?: Date, to?: Date) => {
  if (from && to)
    return `${format(from, "dd/MM/yyyy")} - ${format(to, "dd/MM/yyyy")}`;
  if (from) return `${format(from, "dd/MM/yyyy")} - ...`;
  return "";
};

export const agruparDatas = (datas: string[]): string[][] => {
  if (datas.length === 0) return [];

  const sorted = [...datas].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const grupos: string[][] = [];
  let grupoAtual: string[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const anterior = new Date(sorted[i - 1]);
    const atual = new Date(sorted[i]);
    const diffDias =
      (atual.getTime() - anterior.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDias === 1) {
      grupoAtual.push(sorted[i]);
    } else {
      grupos.push(grupoAtual);
      grupoAtual = [sorted[i]];
    }
  }
  grupos.push(grupoAtual);

  return grupos;
};
