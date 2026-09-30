export type ModalType =
  | "status"
  | "exclusao"
  | "criacao"
  | "edicao"
  | "publicacao"
  | "exclusaoEmMassa"
  | "cadastroEmMassa";

export type ModalSize = "auto" | "sm" | "md" | "lg" | "xl";

export type ModalItemInformationType = {
  id: string;
  status: string;
  nomeExibicao: string;
};

export type ModalExclusaoEmMassaInformationType = {
  quantidade: number;
};

export type ErroLinhaPlanilha = {
  row: number;
  column: string;
  value: string;
  message: string;
};

export type ModalCadastroEmMassaInformationType = {
  erros: ErroLinhaPlanilha[];
};

export type ModalAnyItemInformationType =
  | ModalItemInformationType
  | ModalExclusaoEmMassaInformationType
  | ModalCadastroEmMassaInformationType;
