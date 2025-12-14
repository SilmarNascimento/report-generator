import { format } from "date-fns";
import { DIA_SEMANA_OPCOES } from "@/constants/agenda";
import { ptBR } from "date-fns/locale";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const APP_TIMEZONE =
  import.meta.env.VITE_APP_TIMEZONE || "America/Sao_Paulo";

export const parseDateString = (value?: string | null): string | null => {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  if (isNaN(dateObj.getTime())) return null;

  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  return value;
};

export const dateStrToLocalDate = (
  dateStr?: Date | string,
): Date | undefined => {
  if (!dateStr) return undefined;

  if (dateStr instanceof Date) return dateStr;

  if (typeof dateStr !== "string") return undefined;

  const isoMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}T/);
  if (isoMatch) return new Date(dateStr);

  const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch.map(Number);
    return new Date(y, m - 1, d);
  }

  const dmyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch.map(Number);
    return new Date(y, m - 1, d);
  }

  return undefined;
};

export const formatDateToISOString = (
  date?: Date | null,
): string | undefined => {
  if (!date || isNaN(date.getTime())) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const dateFromUTC = (dateUtc: string | Date): Date => {
  const date = typeof dateUtc === "string" ? new Date(dateUtc) : dateUtc;
  return toZonedTime(date, APP_TIMEZONE);
};

export const dateToUTC = (dateLocal: Date): Date => {
  return fromZonedTime(dateLocal, APP_TIMEZONE);
};

export const formatPtBrDateString = (dataStr?: string | null): string => {
  const valid = parseDateString(dataStr);
  if (!valid) return "";
  const [y, m, d] = valid.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
};

export const formatarPeriodoData = (
  fromStr?: string,
  toStr?: string,
): string => {
  const formatarComDia = (dateStr?: Date | string) => {
    if (!dateStr) return "";

    if (dateStr instanceof Date) {
      const dateObj = dateStr;
      const diaSemanaIndex = (dateObj.getDay() + 6) % 7;
      const diaSemana = DIA_SEMANA_OPCOES[diaSemanaIndex]?.label ?? "";
      const dataFormatada = format(dateObj, "dd/MM/yyyy", { locale: ptBR });

      return `${diaSemana}, ${dataFormatada}`;
    }

    if (typeof dateStr !== "string") return "";

    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const diaSemanaIndex = (dateObj.getDay() + 6) % 7;
    const diaSemana = DIA_SEMANA_OPCOES[diaSemanaIndex]?.label ?? "";
    const dataFormatada = format(dateObj, "dd/MM/yyyy", { locale: ptBR });

    return `${diaSemana}, ${dataFormatada}`;
  };

  if (fromStr && toStr)
    return `${formatarComDia(fromStr)} - ${formatarComDia(toStr)}`;
  if (fromStr) return `${formatarComDia(fromStr)} - ...`;
  return "";
};

export const combineToUtcDateAndTime = (
  dateStr: string,
  timeStr: string,
  timeZone = APP_TIMEZONE,
): Date => {
  const [h, m] = timeStr.split(":").map(Number);
  const dateTimeStr = `${dateStr} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return fromZonedTime(dateTimeStr, timeZone);
};

export const splitToLocalDateTime = (
  date: Date,
  timeZone = APP_TIMEZONE,
): { dateStr: string; timeStr: string } => {
  const zoned = toZonedTime(date, timeZone);
  const dateStr = format(zoned, "yyyy-MM-dd");
  const timeStr = format(zoned, "HH:mm");
  return { dateStr, timeStr };
};

export const formatarDataStrUtcToLocalDateStr = (
  dataStr?: string | null,
): string => {
  const valid = parseDateString(dataStr);
  if (!valid) return "";

  const [y, m, d] = valid.split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const zoned = toZonedTime(dateObj, APP_TIMEZONE);
  return format(zoned, "dd/MM/yyyy", { locale: ptBR });
};

export const agruparDatas = (
  datas: Array<string | undefined | null>,
): string[][] => {
  const filtered = datas.filter(Boolean) as string[];
  if (!filtered.length) return [];

  const sorted = [...filtered].sort((a, b) => {
    const [ay, am, ad] = a.split("-").map(Number);
    const [by, bm, bd] = b.split("-").map(Number);
    return (
      new Date(Date.UTC(ay, am - 1, ad)).getTime() -
      new Date(Date.UTC(by, bm - 1, bd)).getTime()
    );
  });

  const grupos: string[][] = [];
  let grupoAtual: string[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const [ay, am, ad] = sorted[i - 1].split("-").map(Number);
    const [by, bm, bd] = sorted[i].split("-").map(Number);
    const anterior = new Date(Date.UTC(ay, am - 1, ad));
    const atual = new Date(Date.UTC(by, bm - 1, bd));
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
