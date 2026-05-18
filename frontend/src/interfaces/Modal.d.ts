export type ModalType =
  | "status"
  | "exclusao"
  | "criacao"
  | "edicao"
  | "publicacao";

export type ModalItemInformationType = {
  id: string;
  status: string;
  nomeExibicao: string;
};
