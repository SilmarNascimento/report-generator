import { StudentFormType } from "@/components/Forms/student/StudentSchema";
import { MockExamFormType } from "@/components/MockExam/temp";

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

export type FormTypes = StudentFormType | MockExamFormType;
