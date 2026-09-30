import { StudentFormType } from "@/components/Forms/student/studentSchema";
import { CadastroEmMassaFormType } from "@/components/Shared/modal/cadastroEmMassaSchema";
import { MainQuestionFormType } from "@/components/Forms/MainQuestion/MainQuestionSchema";
import { MockExamFormType } from "@/components/Forms/MockExam/mockExamSchema";
import {
  GenerateStudentsResponseFormType,
  StudentDiagnosisStatusFormType,
} from "@/components/Diagnosis/diagnosisSchema";

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
  | MainQuestionFormType
  | GenerateStudentsResponseFormType
  | StudentDiagnosisStatusFormType
  | CadastroEmMassaFormType;
