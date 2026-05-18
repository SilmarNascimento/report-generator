export type ModalType =
  | "status"
  | "exclusao"
  | "criacao"
  | "edicao"
  | "publicacao"
  | "exclusaoEmMassa";

export type ModalItemInformationType = {
  id: string;
  status: string;
  nomeExibicao: string;
};

export type ModalExclusaoEmMassaInformationType = {
  quantidade: number;
};

export type ModalAnyItemInformationType =
  | ModalItemInformationType
  | ModalExclusaoEmMassaInformationType;
