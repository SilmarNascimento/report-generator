import { BadgeDropdownType, DropdownType } from "@/interfaces/general";

export const STUDENT_QUERY_KEY = (id: string) => ["/student", id];

export enum CLASS_GROUP {
  SIMULADO_PRESENCIAL = "SIMULADO_PRESENCIAL",
  SIMULADO_ONLINE = "SIMULADO_ONLINE",
  EXTENSIVO_PRESENCIAL = "EXTENSIVO_PRESENCIAL",
  EXTENSIVO_ONLINE = "EXTENSIVO_ONLINE",
  INTENSIVO_PRESENCIAL = "INTENSIVO_PRESENCIAL",
  INTENSIVO_ONLINE = "INTENSIVO_ONLINE",
}

export const classGroupLabelMap: Record<CLASS_GROUP, string> = {
  [CLASS_GROUP.SIMULADO_PRESENCIAL]: "Simulado Presencial",
  [CLASS_GROUP.SIMULADO_ONLINE]: "Simulado Online",
  [CLASS_GROUP.EXTENSIVO_PRESENCIAL]: "Extensivo Presencial",
  [CLASS_GROUP.EXTENSIVO_ONLINE]: "Extensivo Online",
  [CLASS_GROUP.INTENSIVO_PRESENCIAL]: "Intensivo Presencial",
  [CLASS_GROUP.INTENSIVO_ONLINE]: "Intensivo Online",
};

export const classGroupOptions: DropdownType[] = Object.values(CLASS_GROUP).map(
  (value) => ({
    label: classGroupLabelMap[value],
    value: value,
  }),
);

export const classGroupBadgeOptions: BadgeDropdownType[] = Object.values(
  CLASS_GROUP,
).map((value) => ({
  displayLabel: classGroupLabelMap[value],
  dropdownLabel: classGroupLabelMap[value],
  value: value,
}));
