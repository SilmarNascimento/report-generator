type ModalType = "status" | "exclusao" | "criacao" | "edicao" | "publicacao";

export type ModalItemInformationType = {
  id: number;
  status: string;
  nomeExibicao: string;
  orgao?: string;
  unidade?: string;
  servicos?: string;
  periodoInicio?: string;
  periodoFim?: string;
  publicada?: boolean;
};

export interface ObterAcaoConfirmacaoParams {
  endpoint: string;
  chaveStatus: string;
  nomeEntidade: string;
  atualizarDados: VoidFunction;
}

export interface ConfirmarAlteracaoStatusParams {
  itemSelecionado: ModalItemInformationType;
  endpoint: string;
  chaveStatus: string;
  nomeEntidade: string;
  atualizarDados: () => void;
  fecharModal: () => void;
  abrirModalErro?: (mensagem: string) => void;
}

export interface ConfirmarExclusaoParams {
  itemSelecionado: ModalItemInformationType;
  endpoint: string;
  nomeEntidade: string;
  atualizarDados: () => void;
  fecharModal: () => void;
  abrirModalErro: (mensagem: string) => void;
}
