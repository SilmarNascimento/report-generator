import {
  ModalAnyItemInformationType,
  ModalCadastroEmMassaInformationType,
  ModalExclusaoEmMassaInformationType,
  ModalItemInformationType,
  ModalType,
} from "@/interfaces/Modal";
import { CadastroEmMassaModal } from "./CadastroEmMassaModal";
import { DeleteEmMassaModal } from "./DeleteEmMassaModal";
import { DeleteListagemModal } from "./DeleteListagemModal";

export interface ModalRendererProps {
  isOpen: boolean;
  tipo: ModalType;
  entidade: string;
  item: ModalAnyItemInformationType | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (arquivo?: File) => void;
}

function isListagemItem(
  item: ModalAnyItemInformationType,
): item is ModalItemInformationType {
  return "nomeExibicao" in item;
}

function isExclusaoEmMassaItem(
  item: ModalAnyItemInformationType,
): item is ModalExclusaoEmMassaInformationType {
  return "quantidade" in item;
}

function isCadastroEmMassaItem(
  item: ModalAnyItemInformationType,
): item is ModalCadastroEmMassaInformationType {
  return "erros" in item;
}

export function ModalRenderer({
  isOpen,
  tipo,
  entidade,
  item,
  isLoading,
  onClose,
  onConfirm,
}: ModalRendererProps) {
  if (!isOpen || !item) return null;

  const baseProps = {
    isOpen,
    onClose,
    onConfirm: () => onConfirm(),
    isLoading,
    entidade,
  };

  const renderMap: Record<ModalType, React.ReactNode> = {
    exclusao: isListagemItem(item) ? (
      <DeleteListagemModal {...baseProps} nome={item.nomeExibicao} />
    ) : null,

    exclusaoEmMassa: isExclusaoEmMassaItem(item) ? (
      <DeleteEmMassaModal {...baseProps} quantidade={item.quantidade} />
    ) : null,

    cadastroEmMassa: isCadastroEmMassaItem(item) ? (
      <CadastroEmMassaModal
        {...baseProps}
        erros={item.erros}
        onConfirm={(arquivo) => onConfirm(arquivo)}
      />
    ) : null,

    status: null,
    publicacao: null,
    criacao: null,
    edicao: null,
  };

  return renderMap[tipo] ?? null;
}
