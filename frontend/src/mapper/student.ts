import { BR_STATES } from "@/constants/general";
import { CLASS_GROUP } from "@/constants/students";
import { DropdownType } from "@/interfaces/general";

const classGroupLabelMap: Record<CLASS_GROUP, string> = {
  [CLASS_GROUP.SIMULADO_PRESENCIAL]: "Simulado Presencial",
  [CLASS_GROUP.EXTENSIVO_ONLINE]: "Extensivo Online",
  [CLASS_GROUP.SIMULADO_ONLINE]: "Simulado Online",
  [CLASS_GROUP.INTENSIVO_PRESENCIAL]: "Intensivo Presencial",
  [CLASS_GROUP.INTENSIVO_ONLINE]: "Intensivo Online",
};

export const classGroupOptions: DropdownType[] = Object.values(CLASS_GROUP).map(
  (value) => ({
    label: classGroupLabelMap[value],
    value: value,
  }),
);

const brStatesLabelMap: Record<BR_STATES, string> = {
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
