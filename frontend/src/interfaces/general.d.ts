import { StudentFormType } from "@/components/forms/student/studentSchema";

type ListaPaginada<T> = {
  dados: T[];
  paginacao: Paginacao;
};

export type Paginacao = {
  pagina_atual: number;
  registros_pagina: number;
  total_paginas: number;
  total_registros: number;
};

export type DropdownType = {
  label: string;
  value: string;
};

export type BadgeDropdownType = {
  dropdownLabel: string;
  displayLabel: string;
  value: string;
};

export type FormTypes = StudentFormType;
