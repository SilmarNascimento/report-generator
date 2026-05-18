export type ModalType =
  | "status"
  | "exclusao"
  | "criacao"
  | "edicao"
  | "publicacao";

export type ModalItemInformationType = {
  id: number;
  status: string;
  nomeExibicao: string;
};
