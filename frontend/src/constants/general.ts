import { DropdownType } from "@/interfaces/general";

export enum LerikucasEnum {
  L1 = "1",
  L2 = "2",
  L3 = "3",
  L4 = "4",
  L5 = "5",
  L6 = "6",
  L7 = "7",
  L8 = "8",
}

export enum QuestionLevelEnum {
  FACIL = "Fácil",
  MEDIO = "Médio",
  DIFICIL = "Difícil",
}

export enum QuestionPatternEnum {
  ARITMETICA = "ARITMETICA",
  ALGEBRA = "ALGEBRA",
  GEOMETRIA = "GEOMETRIA",
}

export enum BR_STATES {
  AC = "AC",
  AL = "AL",
  AP = "AP",
  AM = "AM",
  BA = "BA",
  CE = "CE",
  DF = "DF",
  ES = "ES",
  GO = "GO",
  MA = "MA",
  MT = "MT",
  MS = "MS",
  MG = "MG",
  PA = "PA",
  PB = "PB",
  PR = "PR",
  PE = "PE",
  PI = "PI",
  RJ = "RJ",
  RN = "RN",
  RS = "RS",
  RO = "RO",
  RR = "RR",
  SC = "SC",
  SP = "SP",
  SE = "SE",
  TO = "TO",
}

export const brStatesLabelMap: Record<BR_STATES, string> = {
  [BR_STATES.AC]: "Acre",
  [BR_STATES.AL]: "Alagoas",
  [BR_STATES.AP]: "Amapá",
  [BR_STATES.AM]: "Amazonas",
  [BR_STATES.BA]: "Bahia",
  [BR_STATES.CE]: "Ceará",
  [BR_STATES.DF]: "Distrito Federal",
  [BR_STATES.ES]: "Espírito Santo",
  [BR_STATES.GO]: "Goiás",
  [BR_STATES.MA]: "Maranhão",
  [BR_STATES.MT]: "Mato Grosso",
  [BR_STATES.MS]: "Mato Grosso do Sul",
  [BR_STATES.MG]: "Minas Gerais",
  [BR_STATES.PA]: "Pará",
  [BR_STATES.PB]: "Paraíba",
  [BR_STATES.PR]: "Paraná",
  [BR_STATES.PE]: "Pernambuco",
  [BR_STATES.PI]: "Piauí",
  [BR_STATES.RJ]: "Rio de Janeiro",
  [BR_STATES.RN]: "Rio Grande do Norte",
  [BR_STATES.RS]: "Rio Grande do Sul",
  [BR_STATES.RO]: "Rondônia",
  [BR_STATES.RR]: "Roraima",
  [BR_STATES.SC]: "Santa Catarina",
  [BR_STATES.SP]: "São Paulo",
  [BR_STATES.SE]: "Sergipe",
  [BR_STATES.TO]: "Tocantins",
};

export const brStatesOptions: DropdownType[] = Object.values(BR_STATES).map(
  (sigla) => ({
    label: brStatesLabelMap[sigla],
    value: sigla,
  }),
);
