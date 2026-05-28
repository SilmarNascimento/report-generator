import {
  ModalAnyItemInformationType,
  ModalExclusaoEmMassaInformationType,
  ModalType,
} from "@/interfaces/Modal";
import { DeleteEmMassaModal } from "./DeleteEmMassaModal";
import { DeleteListagemModal } from "./DeleteListagemModal";

interface ModalRendererProps {
  isOpen: boolean;
  tipo: ModalType;
  entidade: string;
  item: ModalAnyItemInformationType | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function isExclusaoEmMassaItem(
  item: ModalAnyItemInformationType,
): item is ModalExclusaoEmMassaInformationType {
  return "quantidade" in item;
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

  const baseProps = { isOpen, onClose, onConfirm, isLoading, entidade };

  const renderMap: Record<ModalType, React.ReactNode> = {
    exclusao: !isExclusaoEmMassaItem(item) ? (
      <DeleteListagemModal {...baseProps} nome={item.nomeExibicao} />
    ) : null,

    exclusaoEmMassa: isExclusaoEmMassaItem(item) ? (
      <DeleteEmMassaModal {...baseProps} quantidade={item.quantidade} />
    ) : null,

    status: null,
    publicacao: null,
    criacao: null,
    edicao: null,
  };

  return renderMap[tipo] ?? null;
}
