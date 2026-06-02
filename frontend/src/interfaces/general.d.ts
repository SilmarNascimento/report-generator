import { StudentFormType } from "@/components/forms/student/studentSchema";
import { MainQuestionFormType } from "@/components/Forms/MainQuestion/MainQuestionSchema";
import { MockExamFormType } from "@/components/Forms/MockExam/MockExamSchema";

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

export type FileKind = "pdf" | "excel" | "other";

type MenuOption = {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
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

export type QueryFunctionContext = {
  queryKey: QueryKey;
  pageParam?: unknown;
  signal: AbortSignal;
  meta?: Record<string, unknown>;
};

export type FormTypes =
  | StudentFormType
  | MockExamFormType
  | MainQuestionFormType;
